package models

type ChatSession struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	UserID    uint   `json:"user_id"`
	Title     string `json:"title"`
	Messages  []Message `gorm:"foreignKey:ChatSessionID"`
}

type Message struct {
	ID            uint   `gorm:"primaryKey" json:"id"`
	ChatSessionID uint   `json:"chat_session_id"`
	Sender        string `json:"sender"`
	Content       string `json:"content"`
}