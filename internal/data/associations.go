package data

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

func (s *associationStoreImpl) CreateRequest(userID, orgID uuid.UUID, status OrganizationStatus, permissions []PermissionsEnum) (*Association, error) {
	assocId, err := uuid.NewV7()
	if err != nil {
		return nil, err
	}

	return &Association{
		ID:               	assocId,
		CreatedAt:        	time.Now().UTC(),
		UpdatedAt:        	time.Now().UTC(),
		Status: 		 	status,
		Permissions:      	permissions,
		UserID: 			userID,
		OrganizationID: 	orgID,
		
	}, nil
} 


func (s *associationStoreImpl) CreateAssociation(a *Association) (*Association, error) {

	data := map[string]any{
		"id":                a.ID,
		"created_at":        a.CreatedAt,
		"updated_at":        a.UpdatedAt,
		"status":            a.Status,
		"permissions":       pq.Array(a.Permissions),
		"user_id":           a.UserID,
		"organization_id":   a.OrganizationID,
	}

	query, values, err := BuildInsertQuery("user_associations", data)
	if err != nil {
		return nil, err
	}

	rows, err := s.db.Query(query, values...)
	if err != nil {
		return nil, err
	}

	if rows.Next() {
		return scanIntoAssociation(rows)
	}

	return nil, fmt.Errorf("failed to create association")
}

func (s *associationStoreImpl) GetAssociationByUserID(ID uuid.UUID, expands []string) ([]*Association, error) {
	data := map[string]any{
		"user_id": ID,
		"status":  Active,
	}

	if len(expands) > 0 {
		query, values, err := BuildSelectQueryWithExpansions("user_associations", data, expands)
		if err != nil {
			return nil, err
		}

		rows, err := s.db.Query(query, values...)
		if err != nil {
			return nil, err
		}

		associations := []*Association{}
		for rows.Next() {
			a, err := scanAssociationWithExpansions(rows, expands)
			if err != nil {
				return nil, err
			}
			associations = append(associations, a)
		}

		return associations, nil

	} else {
		query, values, err := BuildSelectQuery("user_associations", data)
		if err != nil {
			return nil, err
		}

		rows, err := s.db.Query(query, values...)
		if err != nil {
			return nil, err
		}

		associations := []*Association{}
		for rows.Next() {
			a, err := scanIntoAssociation(rows)
			if err != nil {
				return nil, err
			}
			associations = append(associations, a)
		}
		return associations, nil

	}
}


type associationStoreImpl struct {
	db *sql.DB
}

var NewAssociationStore = func(db *sql.DB) AssociationStore {
	return &associationStoreImpl{
		db: db,
	}
}

type AssociationStore interface {
	GetAssociationByUserID(ID uuid.UUID, expands []string) ([]*Association, error)

	CreateAssociation(a *Association) (*Association, error)
	CreateRequest(userID, orgID uuid.UUID, status OrganizationStatus, permissions []PermissionsEnum) (*Association, error)
}



func scanIntoAssociation(rows *sql.Rows) (*Association, error) {
	a := new(Association)
	var perms []string 

	err := rows.Scan(
		&a.ID,
		&a.CreatedAt,
		&a.UpdatedAt,
		&a.Status,
		pq.Array(&perms),
		&a.UserID,
		&a.OrganizationID,
	)

	a.Permissions = make([]PermissionsEnum, len(perms))
	for i, p := range perms {
		a.Permissions[i] = PermissionsEnum(p)
	}

	return a, err
}

type Association struct {
	ID                  uuid.UUID 			`json:"id"`
	CreatedAt           time.Time 			`json:"created_at"`
	UpdatedAt           time.Time 			`json:"updated_at"`
	Status				OrganizationStatus  `json:"status"`
	Permissions			[]PermissionsEnum   `json:"permissions"`
	UserID 				uuid.UUID 			`json:"user_id"`
	OrganizationID 		uuid.UUID 			`json:"organization_id"`
	Organization 		*Organization 		`json:"organization,omitempty"`
}

func scanAssociationWithExpansions(rows *sql.Rows, expansions []string) (*Association, error) {
	a := new(Association)
	var perms []string

	basePointers := []any{
		&a.ID,
		&a.CreatedAt,
		&a.UpdatedAt,
		&a.Status,
		pq.Array(&perms),
		&a.UserID,
		&a.OrganizationID,
	}

	var orgJSON []byte
	extraPointers := []any{}
	for _, expand := range expansions {
		switch expand {
		case "organizations":
			extraPointers = append(extraPointers, &orgJSON)
		default:
			return nil, fmt.Errorf("unknown expansion: %s", expand)
		}
	}

	allPointers := append(basePointers, extraPointers...)
	if err := rows.Scan(allPointers...); err != nil {
		return nil, err
	}

	a.Permissions = make([]PermissionsEnum, len(perms))
	for i, p := range perms {
		a.Permissions[i] = PermissionsEnum(p)
	}

	for _, expand := range expansions {
		switch expand {
		case "organizations":
			var orgs []Organization
			if err := json.Unmarshal(orgJSON, &orgs); err != nil {
				return nil, fmt.Errorf("failed to unmarshal organizations JSON: %w", err)
			}
			if len(orgs) > 0 {
				a.Organization = &orgs[0]
			}
		}
	}

	return a, nil
}


type OrganizationStatus string

const (
	Pending   OrganizationStatus = "pending"
	Active   OrganizationStatus = "active"
	Inactive OrganizationStatus = "inactive"
)

type PermissionsEnum string

const (
	ReadUserPermissions    PermissionsEnum = "user.read"
	WriteUserPermissions   PermissionsEnum = "user.write"
	ReadOrganizationPermissions PermissionsEnum = "organization.read"
	WriteOrganizationPermissions PermissionsEnum = "organization.write"
	ReadManifestPermissions PermissionsEnum = "manifest.read"
	WriteManifestPermissions PermissionsEnum = "manifest.write"
	ReadUldPermissions PermissionsEnum = "uld.read"
	WriteUldPermissions PermissionsEnum = "uld.write"
)