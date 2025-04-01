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

	useAlias := len(expansions) > 0
	mainAlias := mainTable
	if useAlias {
		mainAlias = "main"
	}

	var queryBuilder strings.Builder

	queryBuilder.WriteString(fmt.Sprintf("SELECT %s.*", mainAlias))

	for _, expand := range expansions {
		spec, ok := allowedExpansions[expand]
		if !ok {
			return "", nil, fmt.Errorf("expansion %q is not allowed", expand)
		}

		joinCondition := spec.JoinCondition
		if useAlias {
			joinCondition = strings.ReplaceAll(joinCondition, mainTable+".", mainAlias+".")
		}

		subquery := fmt.Sprintf(
			"(SELECT COALESCE(json_agg(%s.*), '[]'::json) FROM %s %s WHERE %s) AS %s",
			spec.Alias, spec.Table, spec.Alias, joinCondition, expand,
		)
		queryBuilder.WriteString(", " + subquery)
	}

	if useAlias {
		queryBuilder.WriteString(fmt.Sprintf(" FROM %s %s", mainTable, mainAlias))
	} else {
		queryBuilder.WriteString(fmt.Sprintf(" FROM %s", mainTable))
	}

	values := []any{}
	if len(conditions) > 0 {
		condKeys := sortedKeys(conditions) 
		whereClauses := make([]string, 0, len(conditions))
		for i, key := range condKeys {
			if useAlias {
				whereClauses = append(whereClauses, fmt.Sprintf("%s.%s = $%d", mainAlias, key, i+1))
			} else {
				whereClauses = append(whereClauses, fmt.Sprintf("%s.%s = $%d", mainTable, key, i+1))
			}
			values = append(values, conditions[key])
		}
		queryBuilder.WriteString(" WHERE " + strings.Join(whereClauses, " AND "))
	}

	return queryBuilder.String(), values, nil
}