package data

import (
	"fmt"
	"strings"
)

type JoinSpec struct {
	Alias         string 
	Table         string 
	JoinCondition string 
}

var allowedExpansions = map[string]JoinSpec{
	"organizations": {
		Alias:         "org",
		Table:         "organizations",
		JoinCondition: "user_associations.organization_id = org.id",
	},
}

func BuildSelectQueryWithExpansions(mainTable string, conditions map[string]any, expansions []string) (string, []any, error) {

	if !isValidTable(mainTable) {
		return "", nil, fmt.Errorf("invalid table name: %s", mainTable)
	}

	queryBuilder := strings.Builder{}
	queryBuilder.WriteString(fmt.Sprintf("SELECT %s.*", mainTable))

	joinClauses := []string{}
	for _, expand := range expansions {
		spec, ok := allowedExpansions[expand]
		if !ok {
			return "", nil, fmt.Errorf("expansion %q is not allowed", expand)
		}

		queryBuilder.WriteString(fmt.Sprintf(", %s.*", spec.Alias))
		joinClause := fmt.Sprintf("LEFT JOIN %s %s ON %s", spec.Table, spec.Alias, spec.JoinCondition)
		joinClauses = append(joinClauses, joinClause)
	}

	queryBuilder.WriteString(fmt.Sprintf(" FROM %s", mainTable))
	for _, joinClause := range joinClauses {
		queryBuilder.WriteString(" ")
		queryBuilder.WriteString(joinClause)
	}

	values := []any{}
	if len(conditions) > 0 {
		condKeys := sortedKeys(conditions)
		whereClauses := make([]string, 0, len(conditions))
		for i, key := range condKeys {
			whereClauses = append(whereClauses, fmt.Sprintf("%s.%s = $%d", mainTable, key, i+1))
			values = append(values, conditions[key])
		}
		queryBuilder.WriteString(" WHERE " + strings.Join(whereClauses, " AND "))
	}

	return queryBuilder.String(), values, nil
}