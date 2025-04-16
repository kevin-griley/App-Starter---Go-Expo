package data

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type PostUserRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (s *userStoreImpl) CreateUser(r *PostUserRequest) (*User, error) {
	encpwd, err := bcrypt.GenerateFromPassword([]byte(r.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	ID, err := uuid.NewV7()
	if err != nil {
		return nil, err
	}

	data := map[string]any{
		"id":              ID,
		"created_at":      time.Now().UTC(),
		"updated_at":      time.Now().UTC(),
		"user_name":       r.Email,
		"email":           r.Email,
		"hashed_password": string(encpwd),
		"last_request":    time.Now().UTC(),
		"last_login":      time.Now().UTC(),
	}

	query, values, err := BuildInsertQuery("users", data)
	if err != nil {
		return nil, err
	}

	rows, err := s.db.Query(query, values...)
	if err != nil {
		return nil, err
	}

	if rows.Next() {
		return scanIntoUser(rows)
	}

	return nil, fmt.Errorf("failed to create user")

}

type PatchUserRequest struct {
	UserName *string `json:"user_name"`
	Password *string `json:"password"`
}

func (s *userStoreImpl) UpdateUser(ID uuid.UUID, r *PatchUserRequest) (*User, error) {

	updateData := make(map[string]any)
	updateData["updated_at"] = time.Now().UTC()

	if r.UserName != nil {
		updateData["user_name"] = r.UserName
	}

	if r.Password != nil {
		encpwd, err := bcrypt.GenerateFromPassword([]byte(*r.Password), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}
		updateData["hashed_password"] = string(encpwd)
	}

	conditions := map[string]any{
		"id": ID,
	}

	query, args, err := BuildUpdateQuery("users", updateData, conditions)
	if err != nil {
		return nil, err
	}

	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	if rows.Next() {
		return scanIntoUser(rows)
	}

	return nil, fmt.Errorf("failed to update user")
}

func (s *userStoreImpl) GetUserByEmail(email string) (*User, error) {

	data := map[string]any{
		"email": email,
	}

	query, values, err := BuildSelectQuery("users", data)
	if err != nil {
		return nil, err
	}

	rows, err := s.db.Query(query, values...)
	if err != nil {
		return nil, err
	}
	if rows.Next() {
		return scanIntoUser(rows)
	}
	return nil, fmt.Errorf("user %s not found", email)
}

func (s *userStoreImpl) GetUserByID(ID uuid.UUID) (*User, error) {

	data := map[string]any{
		"id": ID,
	}

	query, values, err := BuildSelectQuery("users", data)
	if err != nil {
		return nil, err
	}

	rows, err := s.db.Query(query, values...)
	if err != nil {
		return nil, err
	}
	if rows.Next() {
		return scanIntoUser(rows)
	}
	return nil, fmt.Errorf("user %s not found", ID)
}

func (u *User) ValidPassword(password string) bool {
	return bcrypt.CompareHashAndPassword([]byte(u.HashedPassword),
		[]byte(password)) == nil
}

type userStoreImpl struct {
	db *sql.DB
}

var NewUserStore = func(db *sql.DB) UserStore {
	return &userStoreImpl{
		db: db,
	}
}

type UserStore interface {
	GetUserByEmail(email string) (*User, error)
	GetUserByID(ID uuid.UUID) (*User, error)

	CreateUser(r *PostUserRequest) (*User, error)
	UpdateUser(ID uuid.UUID,r *PatchUserRequest) (*User, error)
}

type User struct {
	ID                  uuid.UUID `json:"id"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
	UserName            string    `json:"user_name"`
	Email               string    `json:"email"`
	HashedPassword      string    `json:"-"`
	IsAdmin             bool      `json:"-"`
	IsVerified          bool      `json:"-"`
	IsDeleted           bool      `json:"-"`
	LastRequest         time.Time `json:"-"`
	LastLogin           time.Time `json:"-"`
	FailedLoginAttempts int       `json:"-"`
}

func scanIntoUser(rows *sql.Rows) (*User, error) {
	u := new(User)
	err := rows.Scan(
		&u.ID,
		&u.CreatedAt,
		&u.UpdatedAt,
		&u.UserName,
		&u.Email,
		&u.HashedPassword,
		&u.IsAdmin,
		&u.IsVerified,
		&u.IsDeleted,
		&u.LastRequest,
		&u.LastLogin,
		&u.FailedLoginAttempts,
	)
	return u, err
}
