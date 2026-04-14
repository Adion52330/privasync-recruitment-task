package repository

import (
	"backend/models"
	"backend/config"
)

func CreateSession(userID uint, title string) (*models.ChatSession, error) {
	session := models.ChatSession{UserID: userID, Title: title}
	if err := config.DB.Create(&session).Error; err != nil {
		return nil, err
	}
	return &session, nil
}

func SaveMessage(sessionID uint, role, content string) error {
	msg := models.Message{
		ChatSessionID: sessionID,
		Sender:          role,
		Content:       content,
	}

	return config.DB.Create(&msg).Error
}

func GetUserSessions(userID uint) ([]models.ChatSession, error) {
	var sessions []models.ChatSession
	err := config.DB.Where("user_id = ?", userID).Order("id DESC").Find(&sessions).Error
	return sessions, err
}

func GetSessionMessages(sessionID uint) ([]models.Message, error) {
	var messages []models.Message
	err := config.DB.Where("chat_session_id = ?", sessionID).Order("id ASC").Find(&messages).Error
	return messages, err
}

func GetLatestSession(userID uint) (*models.ChatSession, error) {
	var session models.ChatSession

	err := config.DB.
		Where("user_id = ?", userID).
		Order("id DESC").
		First(&session).Error

	return &session, err
}