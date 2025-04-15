package data

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
)



func (s *organizationStoreImpl) CreateRequest(name, formatted_address, contactInfo string, address map[string]any, organizationType OrganizationType) (*Organization, error) {

	orgId, err := uuid.NewV7()
	if err != nil {
		return nil, err
	}

	uniqueURL := GenerateRandomString(10)

	return &Organization{
		ID:               orgId,
		CreatedAt:        time.Now().UTC(),
		UpdatedAt:        time.Now().UTC(),
		Name:             name,
		UniqueURL:        uniqueURL,
		FormattedAddress: formatted_address,
		Address:          address,
		ContactInfo:      contactInfo,
		OrganizationType: organizationType,
		IsDeleted:        false,
	}, nil
}

func (s *organizationStoreImpl) CreateOrganization(o *Organization) (*Organization, error) {

	jsonAddress, err := json.Marshal(o.Address)
	if err != nil {
		return nil, err
	}

	data := map[string]any{
		"id":                o.ID,
		"created_at":        o.CreatedAt,
		"updated_at":        o.UpdatedAt,
		"name":              o.Name,
		"unique_url":        o.UniqueURL,
		"formatted_address": o.FormattedAddress,
		"address":           jsonAddress,
		"contact_info":      o.ContactInfo,
		"organization_type": o.OrganizationType,
		"logo_url":          o.LogoUrl,
		"scac":              o.SCAC,
		"is_deleted":        o.IsDeleted,
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

func (s *organizationStoreImpl) UpdateRequest(
	name, 
	formatted_address, 
	logo_url,
	contactInfo string, 
	address map[string]any, 
	organizationType OrganizationType,
) (*Organization, error) {

	return &Organization{
		Name:             name,
		FormattedAddress: formatted_address,
		Address:          address,
		ContactInfo:      contactInfo,
		OrganizationType: organizationType,
		LogoUrl:          logo_url,
		IsDeleted:        false,
	}, nil
}

func (s *organizationStoreImpl) UpdateOrganization(o *Organization) (*Organization, error) {

	updateData := make(map[string]any)
	updateData["updated_at"] = time.Now().UTC()

	if o.Name != "" {
		updateData["name"] = o.Name
	}
	if o.UniqueURL != "" {
		updateData["unique_url"] = o.UniqueURL
	}
	if o.FormattedAddress != "" {
		jsonAddress, err := json.Marshal(o.Address)
		if err != nil {
			return nil, err
		}

		updateData["address"] = jsonAddress
		updateData["formatted_address"] = o.FormattedAddress
	}
	if o.ContactInfo != "" {
		updateData["contact_info"] = o.ContactInfo
	}
	if o.OrganizationType != "" {
		updateData["organization_type"] = o.OrganizationType
	}
	if o.LogoUrl != "" {
		updateData["logo_url"] = o.LogoUrl
	}

	conditions := map[string]any{
		"id": o.ID,
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

	CreateOrganization(o *Organization) (*Organization, error)
	CreateRequest(name, formatted_address, contactInfo string, address map[string]any, organizationType OrganizationType) (*Organization, error)

	UpdateOrganization(o *Organization) (*Organization, error)
	UpdateRequest(name, formatted_address, logo_url, contactInfo string, address map[string]any, organizationType OrganizationType) (*Organization, error)
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


