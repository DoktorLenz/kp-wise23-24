package quiz

import (
	"encoding/json"
	"errors"

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
		utils.Prompt("Quiz not found: %+v", quiz)
		return nil, errors.New("Quiz not found: " + quiz.ID)
	}

	quizzes = append(quizzes[:index], quizzes[index+1:]...)
	err = SaveAllQuizzes(quizzes)

	return quizzes, err

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
