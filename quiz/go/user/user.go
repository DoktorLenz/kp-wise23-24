package user

import (
	"encoding/json"

	"github.com/DoktorLenz/kp-wise23-24/quiz/go/utils"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	// Encoded Password
	Password string `json:"password"`
}

type IUser interface {
	GetID() string
	GetUsername() string
	GetEncodedPassword() string
	CheckPassword(password string) bool
	Save() error
}

func CreateUser(username string, password string) (IUser, error) {
	users, err := GetAllUsers()
	if err != nil {
		return nil, err
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &User{
		ID:       uuid.New().String(),
		Username: username,
		Password: string(passwordHash),
	}

	users = append(users, user)
	err = SaveAllUsers(users)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (u *User) GetID() string {
	return u.ID
}

func (u *User) GetUsername() string {
	return u.Username
}

func (u *User) GetEncodedPassword() string {
	return u.Password
}

func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}

func (u *User) Save() error {
	users, err := GetAllUsers()
	if err != nil {
		return err
	}

	users = append(users, u)
	return SaveAllUsers(users)
}

func GetAllUsers() ([]*User, error) {

	var data []*User
	fileContent, err := utils.ReadFile("users.json")
	if err != nil {
		fileContent = []byte("[]")
	}
	err = json.Unmarshal(fileContent, &data)
	if err != nil {
		return nil, err
	}
	return data, nil
}

func SaveAllUsers(users []*User) error {
	b, err := json.Marshal(users)
	if err != nil {
		return err
	}
	utils.Prompt(string(b), nil)
	err = utils.WriteFile("users.json", b)
	if err != nil {
		return err
	}
	return nil
}

func CheckLogin(username string, password string) (IUser, error) {
	users, err := GetAllUsers()
	if err != nil {
		return nil, err
	}

	for _, user := range users {
		if user.Username == username && user.CheckPassword(password) {
			return user, nil
		}
	}

	return nil, nil
}

func IsUsernameTaken(username string) (bool, error) {
	users, err := GetAllUsers()
	if err != nil {
		return false, err
	}

	for _, user := range users {
		if user.Username == username {
			return true, nil
		}
	}

	return false, nil
}
