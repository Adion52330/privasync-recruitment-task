package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type GeminiRequest struct {
	Contents []struct {
		Parts []struct {
			Text string `json:"text"`
		} `json:"parts"`
	} `json:"contents"`
}

type GeminiResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
}

func CallAI(prompt string) (string, error) {

	apiKey := os.Getenv("GEMINI_API_KEY")

	url := fmt.Sprintf(
		"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=%s",
		apiKey,
	)

	reqBody := GeminiRequest{
		Contents: []struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		}{
			{
				Parts: []struct {
					Text string `json:"text"`
				}{
					{Text: prompt},
				},
			},
		},
	}

	jsonData, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)
	fmt.Println("RAW:", string(bodyBytes))

	if resp.StatusCode != 200 {
		return "", fmt.Errorf("Gemini error: %s", string(bodyBytes))
	}

	var aiResp GeminiResponse
	err = json.Unmarshal(bodyBytes, &aiResp)
	if err != nil {
		return "", err
	}

	if len(aiResp.Candidates) > 0 &&
		len(aiResp.Candidates[0].Content.Parts) > 0 {

		return aiResp.Candidates[0].Content.Parts[0].Text, nil
	}

	return "No response from AI", nil
}
