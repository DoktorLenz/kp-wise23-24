package utils

import (
	"fmt"
	"os"
	"path/filepath"
)

var dataDir, _ = os.UserConfigDir()

func GetDataDir() string {
	baseDir, err := os.UserConfigDir()
	if err != nil {
		panic(err)
	}
	return filepath.Join(baseDir, "quiz")
}

func WriteFile(fileName string, data []byte) error {
	filePath := filepath.Join(GetDataDir(), fileName)
	dir := filepath.Dir(filePath)

	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	fmt.Println(filePath)
	return os.WriteFile(filePath, data, 0644)
}

func ReadFile(fileName string) ([]byte, error) {
	filePath := filepath.Join(GetDataDir(), fileName)
	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, err
	}
	return data, nil
}
