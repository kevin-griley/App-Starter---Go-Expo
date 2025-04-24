package data

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
)


type PostOrganizationRequest struct {
	Name             string           `json:"name"`
	Address          map[string]any   `json:"address"`
	ContactInfo      string           `json:"contact_info"`
	OrganizationType OrganizationType `json:"organization_type"`
}

func (s *organizationStoreImpl) CreateOrganization(r *PostOrganizationRequest) (*Organization, error) {
	ID, err := uuid.NewV7()
	if err != nil {
		return nil, err
	}

	jsonAddress, err := json.Marshal(r.Address)
	if err != nil {
		return nil, err
	}

	formatted, ok := (r.Address)["formatted_address"];
	if !ok {
		return nil, fmt.Errorf("missing formatted_address in address")
	}

	data := map[string]any{
		"id":                ID,
		"created_at":        time.Now().UTC(),
		"updated_at":        time.Now().UTC(),
		"name":              r.Name,
		"unique_url":        GenerateRandomString(10),
		"formatted_address": formatted,
		"address":           jsonAddress,
		"contact_info":      r.ContactInfo,
		"organization_type": r.OrganizationType,
		"logo_url":          "",
		"scac":              "",
		"is_deleted":        false,
	}

	query, values, err := BuildInsertQuery("organizations", data)
	if err != nil {
		return nil, err
	}

	rows, err := s.db.Query(query, values...)
	if err != nil {
		return nil, err
	}

	if rows.Next() {
		return scanIntoOrganization(rows)
	}

	return nil, fmt.Errorf("failed to create organization")

}

type PatchOrganizationRequest struct {
	Name            	*string				`json:"name"`
	Address         	*map[string]any		`json:"address"`
	LogoURL		 		*string				`json:"logo_url"`
	ContactInfo     	*string				`json:"contact_info"`
	OrganizationType	*OrganizationType	`json:"organization_type"`
}

func (s *organizationStoreImpl) UpdateOrganization(ID uuid.UUID, r *PatchOrganizationRequest) (*Organization, error) {

	updateData := make(map[string]any)
	updateData["updated_at"] = time.Now().UTC()

	if r.Name != nil {
		updateData["name"] = r.Name
	}

	if r.Address != nil {
		formatted, ok := (*r.Address)["formatted_address"];
		if !ok {
			return nil, fmt.Errorf("missing formatted_address in address")
		}
		updateData["formatted_address"] = formatted

		jsonAddress, err := json.Marshal(r.Address)
		if err != nil {
			return nil, err
		}
		updateData["address"] = jsonAddress
		
	}
	if r.ContactInfo != nil {
		updateData["contact_info"] = r.ContactInfo
	}
	if r.OrganizationType != nil {
		updateData["organization_type"] = r.OrganizationType
	}
	if r.LogoURL != nil {
		updateData["logo_url"] = r.LogoURL
	}

	conditions := map[string]any{
		"id": ID,
	}

	query, values, err := BuildUpdateQuery("organizations", updateData, conditions)
	if err != nil {
		return nil, err
	}

	rows, err := s.db.Query(query, values...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	if rows.Next() {
		return scanIntoOrganization(rows)
	}

	return nil, fmt.Errorf("failed to update organization")

}

func (s *organizationStoreImpl) DeleteOrganization(ID uuid.UUID, ) (*Organization, error) {

	updateData := make(map[string]any)
	updateData["updated_at"] = time.Now().UTC()
	updateData["is_deleted"] = true

	conditions := map[string]any{
		"id": ID,
	}

	query, values, err := BuildUpdateQuery("organizations", updateData, conditions)
	if err != nil {
		return nil, err
	}

	rows, err := s.db.Query(query, values...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	if rows.Next() {
		return scanIntoOrganization(rows)
	}

	return nil, fmt.Errorf("failed to update organization")

}

func (s *organizationStoreImpl) GetOrganizationByID(ID uuid.UUID) (*Organization, error) {

	data := map[string]any{
		"ID": ID,
	}

	query, values, err := BuildSelectQuery("organizations", data)
	if err != nil {
		return nil, err
	}

	rows, err := s.db.Query(query, values...)
	if err != nil {
		return nil, err
	}

	if rows.Next() {
		return scanIntoOrganization(rows)
	}

	return nil, fmt.Errorf("organization %s not found", ID)

}

func (s *organizationStoreImpl) GetOrganizationByName(name string) (*Organization, error) {

	data := map[string]any{
		"name": name,
	}

	query, values, err := BuildSelectQuery("organizations", data)
	if err != nil {
		return nil, err
	}

	rows, err := s.db.Query(query, values...)
	if err != nil {
		return nil, err
	}

	if rows.Next() {
		return scanIntoOrganization(rows)
	}

	return nil, fmt.Errorf("organization %s not found", name)

}

func (s *organizationStoreImpl) GetOrganizationByUniqueURL(uniqueURL string) (*Organization, error) {

	data := map[string]any{
		"unique_url": uniqueURL,
	}

	query, values, err := BuildSelectQuery("organizations", data)
	if err != nil {
		return nil, err
	}

	rows, err := s.db.Query(query, values...)
	if err != nil {
		return nil, err
	}

	if rows.Next() {
		return scanIntoOrganization(rows)
	}

	return nil, fmt.Errorf("organization %s not found", uniqueURL)

}

type organizationStoreImpl struct {
	db *sql.DB
}

var NewOrganizationStore = func(db *sql.DB) OrganizationStore {
	return &organizationStoreImpl{
		db: db,
	}
}

type OrganizationStore interface {
	GetOrganizationByID(ID uuid.UUID) (*Organization, error)
	GetOrganizationByName(name string) (*Organization, error)
	GetOrganizationByUniqueURL(uniqueURL string) (*Organization, error)

	CreateOrganization(r *PostOrganizationRequest) (*Organization, error)
	UpdateOrganization(ID uuid.UUID, r *PatchOrganizationRequest) (*Organization, error)
	DeleteOrganization(ID uuid.UUID) (*Organization, error)

}

type OrganizationType string

const (
	Airline   OrganizationType = "airline"
	Carrier   OrganizationType = "carrier"
	Warehouse OrganizationType = "warehouse"
)

type Organization struct {
	ID               uuid.UUID        	`json:"id"`
	CreatedAt        time.Time        	`json:"created_at"`
	UpdatedAt        time.Time        	`json:"updated_at"`
	Name             string           	`json:"name"`
	UniqueURL        string           	`json:"unique_url"`
	FormattedAddress string           	`json:"formatted_address"`
	Address          map[string]any 	`json:"address"`
	ContactInfo      string           	`json:"contact_info"`
	OrganizationType OrganizationType 	`json:"organization_type"`
	LogoUrl			string           	`json:"logo_url"`
	SCAC			string           	`json:"scac"`
	IsDeleted		 bool             	`json:"is_deleted"`

}

func scanIntoOrganization(rows *sql.Rows) (*Organization, error) {
	o := new(Organization)

	var addressBytes []byte

	err := rows.Scan(
		&o.ID,
		&o.CreatedAt,
		&o.UpdatedAt,
		&o.Name,
		&o.UniqueURL,
		&o.FormattedAddress,
		&addressBytes,
		&o.ContactInfo,
		&o.OrganizationType,
		&o.LogoUrl,
		&o.SCAC,
		&o.IsDeleted,
	)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(addressBytes, &o.Address); err != nil {
		return nil, err
	}

	return o, nil
}


