package models

type ChatSession struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	UserID    uint   `json:"user_id"`
	Title     string `json:"title"`
	Messages  []Message `gorm:"foreignKey:ChatSessionID" json:"messages"`
}

type Message struct {
	ID            uint   `gorm:"primaryKey" json:"id"`
	ChatSessionID uint  
	Sender        string `json:"sender"`
	Content       string `json:"content"`
}