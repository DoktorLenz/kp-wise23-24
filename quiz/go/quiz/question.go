package quiz

import (
	"errors"

	"github.com/DoktorLenz/kp-wise23-24/quiz/go/utils"
	"github.com/manifoldco/promptui"
)

type Question struct {
	ID          string      `json:"id"`
	Title       string      `json:"title"`
	Description string      `json:"description"`
	Solution    interface{} `json:"solution"`
}

type IQuestion interface {
	Ask() (bool, error)
	Edit() error
	GetID() string
	GetTitle() string
	GetDescription() string
	GetSolutionText() string
}

func (q Question) GetID() string {
	return q.ID
}

func (q Question) GetTitle() string {
	return q.Title
}

func (q Question) GetDescription() string {
	return q.Description
}

func (q *Question) Edit() error {
	utils.Clear()

	titlePrompt := promptui.Prompt{
		Label:   "Please enter the title of the question",
		Default: q.Title,
		Validate: func(input string) error {
			if len(input) == 0 {
				return errors.New("the title must not be empty")
			}
			if len(input) > 100 {
				return errors.New("the title must not be longer than 100 characters")
			}

			return nil
		},
	}

	descriptionPrompt := promptui.Prompt{
		Label:   "Please enter the description of the question",
		Default: q.Description,
		Validate: func(input string) error {
			if len(input) > 100 {
				return errors.New("the description must not be longer than 100 characters")
			}

			return nil
		},
	}

	newTitle, err := titlePrompt.Run()
	if err != nil {
		return err
	}
	newDescription, err := descriptionPrompt.Run()
	if err != nil {
		return err
	}

	q.Title = newTitle
	q.Description = newDescription

	return nil
}

func (q Question) PrintTitle() {
	utils.Prompt("%s", q.Title)
}
