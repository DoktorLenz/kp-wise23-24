package quiz

import (
	"encoding/json"

	"github.com/DoktorLenz/kp-wise23-24/quiz/go/utils"
)

type Quiz struct {
	ID          string                     `json:"id"`
	UserID      string                     `json:"userId"`
	Name        string                     `json:"name"`
	Description string                     `json:"description"`
	ShareCode   string                     `json:"shareCode"`
	Questions   []Question                 `json:"questions"`
	Responses   map[string]map[string]bool `json:"responses"`
}

func GetAllQuizzes() ([]*Quiz, error) {
	var data []*Quiz
	fileContent, err := utils.ReadFile("quizzes.json")
	if err != nil || len(fileContent) == 0 {
		fileContent = []byte("[]")
	}
	err = json.Unmarshal(fileContent, &data)
	if err != nil {
		return nil, err
	}
	return data, nil
}

func SaveAllQuizzes(quizzes []*Quiz) error {
	data, err := json.Marshal(quizzes)
	if err != nil {
		return err
	}
	return utils.WriteFile("quizzes.json", data)
}
