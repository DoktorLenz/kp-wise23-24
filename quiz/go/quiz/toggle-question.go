package quiz

import "encoding/json"

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
