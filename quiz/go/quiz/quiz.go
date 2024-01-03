package quiz

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"strconv"

	"github.com/DoktorLenz/kp-wise23-24/quiz/go/utils"
	"github.com/google/uuid"
)

type RawQuiz struct {
	ID          string                     `json:"id"`
	UserID      string                     `json:"userId"`
	Name        string                     `json:"name"`
	Description string                     `json:"description"`
	ShareCode   string                     `json:"shareCode"`
	Questions   []interface{}              `json:"questions"`
	Responses   map[string]map[string]bool `json:"responses"`
}

type Quiz struct {
	ID          string                     `json:"id"`
	UserID      string                     `json:"userId"`
	Name        string                     `json:"name"`
	Description string                     `json:"description"`
	ShareCode   string                     `json:"shareCode"`
	Questions   []IQuestion                `json:"questions"`
	Responses   map[string]map[string]bool `json:"responses"`
}

func (quiz *Quiz) Delete() ([]*Quiz, error) {
	quizzes, err := GetAllQuizzes()
	if err != nil {
		return nil, err
	}
	index := -1
	for i, q := range quizzes {
		if q.ID == quiz.ID {
			index = i
			break
		}
	}

	if index == -1 {
		return nil, errors.New("Quiz not found: " + quiz.ID)
	}

	quizzes = append(quizzes[:index], quizzes[index+1:]...)
	err = SaveAllQuizzes(quizzes)

	return quizzes, err

}

func (quiz *Quiz) Save() error {
	quizzes, err := GetAllQuizzes()
	if err != nil {
		return err
	}

	index := -1
	for i, q := range quizzes {
		if q.ID == quiz.ID {
			index = i
			break
		}
	}

	if index == -1 {
		return errors.New("Quiz not found: " + quiz.ID)
	}

	quizzes[index] = quiz

	err = SaveAllQuizzes(quizzes)

	return err
}

func (quiz *Quiz) AddQuestion(question IQuestion) IQuestion {
	quiz.Questions = append(quiz.Questions, question)
	return question
}

func (quiz *Quiz) RemoveQuestion(id string) {
	for i, question := range quiz.Questions {
		if question.GetID() == id {
			quiz.Questions = append(quiz.Questions[:i], quiz.Questions[i+1:]...)
			return
		}
	}
}

func (quiz *Quiz) AddResponse(answers map[string]bool) {
	quiz.Responses[uuid.New().String()] = answers
}

func Create(userId string, name string) (*Quiz, error) {
	quizzes, err := GetAllQuizzes()
	if err != nil {
		return nil, err
	}

	quiz := &Quiz{
		ID:        uuid.New().String(),
		UserID:    userId,
		Name:      name,
		Questions: make([]IQuestion, 0),
		Responses: make(map[string]map[string]bool),
	}

	quiz.ShareCode = GenerateShareCode(quiz.ID)

	quizzes = append(quizzes, quiz)

	err = SaveAllQuizzes(quizzes)

	return quiz, err
}

func GetAllQuizzesForUser(userID string) ([]*Quiz, error) {
	quizzes, err := GetAllQuizzes()
	if err != nil {
		return nil, err
	}

	var userQuizzes []*Quiz
	for _, quiz := range quizzes {
		if quiz.UserID == userID {
			userQuizzes = append(userQuizzes, quiz)
		}
	}

	return userQuizzes, nil
}

func GetAllQuizzes() ([]*Quiz, error) {
	var rawQuizzes []*RawQuiz
	fileContent, err := utils.ReadFile("quizzes.json")
	if err != nil || len(fileContent) == 0 {
		fileContent = []byte("[]")
	}
	err = json.Unmarshal(fileContent, &rawQuizzes)
	if err != nil {
		return nil, err
	}

	var quizzes []*Quiz

	for _, rawQuiz := range rawQuizzes {
		quiz := &Quiz{
			ID:          rawQuiz.ID,
			UserID:      rawQuiz.UserID,
			Name:        rawQuiz.Name,
			Description: rawQuiz.Description,
			ShareCode:   rawQuiz.ShareCode,
			Questions:   make([]IQuestion, 0),
			Responses:   rawQuiz.Responses,
		}
		for _, question := range rawQuiz.Questions {
			questionMap := question.(map[string]interface{})
			switch questionMap["__type"].(string) {
			case "ToggleQuestion":
				var tq *ToggleQuestion = &ToggleQuestion{}
				questionData, err := json.Marshal(question)
				if err != nil {
					return nil, err
				}
				err = json.Unmarshal(questionData, tq)
				if err != nil {
					return nil, err
				}
				quiz.Questions = append(quiz.Questions, tq)
			}
		}
		quizzes = append(quizzes, quiz)
	}

	return quizzes, nil
}

func SaveAllQuizzes(quizzes []*Quiz) error {
	data, err := json.Marshal(quizzes)
	if err != nil {
		return err
	}
	return utils.WriteFile("quizzes.json", data)
}

func AvailableShareCodes() ([]string, error) {
	quizzes, err := GetAllQuizzes()
	if err != nil {
		return nil, err
	}

	var shareCodes []string
	for _, quiz := range quizzes {
		shareCodes = append(shareCodes, quiz.ShareCode)
	}

	return shareCodes, nil
}

func GetQuizByShareCode(shareCode string) (*Quiz, error) {
	quizzes, err := GetAllQuizzes()
	if err != nil {
		return nil, err
	}

	for _, quiz := range quizzes {
		if quiz.ShareCode == shareCode {
			return quiz, nil
		}
	}

	return nil, errors.New("Quiz not found")
}

func GenerateShareCode(id string) string {
	hasher := sha256.New()
	hasher.Write([]byte(id))
	hash := hasher.Sum(nil)
	hashHex := hex.EncodeToString(hash)
	hashHexTruncated := hashHex[:8]
	shareCode, _ := strconv.ParseInt(hashHexTruncated, 16, 64)
	return strconv.FormatInt(shareCode, 36)
}
