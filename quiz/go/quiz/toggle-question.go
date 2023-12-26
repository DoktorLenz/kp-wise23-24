package quiz

import (
	"encoding/json"
	"errors"

	"github.com/manifoldco/promptui"
)

type ToggleQuestion struct {
	Question
	TrueText  string `json:"trueText"`
	FalseText string `json:"falseText"`
}

func (tq ToggleQuestion) MarshalJSON() ([]byte, error) {
	type Alias ToggleQuestion
	return json.Marshal(&struct {
		Type string `json:"__type"`
		*Alias
	}{
		Type:  "ToggleQuestion",
		Alias: (*Alias)(&tq),
	})
}

func (tq *ToggleQuestion) CheckAnswer(answer bool) bool {
	return tq.Question.Solution.(bool) == answer
}

func (tq *ToggleQuestion) Ask() (interface{}, error) {
	prompt := promptui.Select{
		Label: tq.Question.Title,
		Items: []string{tq.TrueText, tq.FalseText},
	}

	_, answer, err := prompt.Run()
	if err != nil {
		return nil, err
	}

	return answer == tq.TrueText, nil
}

func (tq *ToggleQuestion) GetSolutionText() string {
	if tq.Question.Solution.(bool) {
		return tq.TrueText
	} else {
		return tq.FalseText
	}
}

func (tq *ToggleQuestion) Edit() error {
	tq.Question.Edit()

	trueTextPrompt := promptui.Prompt{
		Label:   "Please enter the text for option 1",
		Default: tq.TrueText,
		Validate: func(input string) error {
			if len(input) == 0 {
				return errors.New("The text must not be empty")
			}
			if len(input) > 100 {
				return errors.New("The text must not be longer than 100 characters")
			}

			return nil
		},
	}

	falseTextPrompt := promptui.Prompt{
		Label:   "Please enter the text for option 2",
		Default: tq.FalseText,
		Validate: func(input string) error {
			if len(input) == 0 {
				return errors.New("The text must not be empty")
			}
			if len(input) > 100 {
				return errors.New("The text must not be longer than 100 characters")
			}

			return nil
		},
	}

	newTrueText, err := trueTextPrompt.Run()
	if err != nil {
		return err
	}
	newFalseText, err := falseTextPrompt.Run()
	if err != nil {
		return err
	}

	solutionPrompt := promptui.Select{
		Label: tq.Question.Title,
		Items: []string{newTrueText, newFalseText},
	}

	_, solution, err := solutionPrompt.Run()
	if err != nil {
		return err
	}

	tq.TrueText = newTrueText
	tq.FalseText = newFalseText
	tq.Solution = solution == tq.TrueText

	return nil

}
