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
	Questions   []interface{}              `json:"questions"`
	Responses   map[string]map[string]bool `json:"responses"`
}

func GetAllQuizzes() ([]*Quiz, error) {
	var quizzes []*Quiz
	fileContent, err := utils.ReadFile("quizzes.json")
	if err != nil || len(fileContent) == 0 {
		fileContent = []byte("[]")
	}
	err = json.Unmarshal(fileContent, &quizzes)
	if err != nil {
		return nil, err
	}

	for _, quiz := range quizzes {
		for i, question := range quiz.Questions {
			questionMap := question.(map[string]interface{})
			switch questionMap["__type"].(string) {
			case "ToggleQuestion":
				var tq ToggleQuestion
				questionData, err := json.Marshal(question)
				if err != nil {
					return nil, err
				}
				err = json.Unmarshal(questionData, &tq)
				if err != nil {
					return nil, err
				}
				quiz.Questions[i] = tq
			}
		}
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
