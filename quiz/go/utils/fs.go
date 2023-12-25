package utils

import (
	"os"
	"path/filepath"
)

var dataDir = ""

func WriteFile(fileName string, data []byte) error {
	filePath := filepath.Join(dataDir, fileName)
	dir := filepath.Dir(filePath)

	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	return os.WriteFile(filePath, data, 0644)
}

func ReadFile(fileName string) ([]byte, error) {
	filePath := filepath.Join(dataDir, fileName)
	return os.ReadFile(filePath)
}
