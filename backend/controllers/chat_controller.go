package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"backend/models"
	"backend/repository"
	"backend/services"
	"backend/utils"
)

type Request struct {
	Message   string `json:"message"`
	SessionID uint   `json:"session_id"`
}

func Chat(c *gin.Context) {
	var req Request

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userInterface, _ := c.Get("user")
	user := userInterface.(*models.User)

	session, err := repository.GetLatestSession(user.ID)

	if err != nil {
		session, err = repository.CreateSession(user.ID, "Chat with AI")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not create session"})
			return
		}
	}

	repository.SaveMessage(session.ID, "user", req.Message)

	messagesDB, _ := repository.GetSessionMessages(session.ID)

	var fullPrompt string

	for _, msg := range messagesDB {
		fullPrompt += msg.Sender + ": " + msg.Content + "\n"
	}

	fullPrompt += "user: " + req.Message

	response, err := services.CallAI(fullPrompt)
	if err != nil {
		fmt.Println("AI ERROR:", err)
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	repository.SaveMessage(session.ID, "ai", response)

	c.JSON(http.StatusOK, gin.H{"session_id": session.ID, "response": response})
}

func GetMessages(c *gin.Context) {
	sessionID := c.Param("id")
	messages, err := repository.GetSessionMessages(utils.ParseUint(sessionID))
	if err != nil {
		c.JSON(500, gin.H{"error": "could not fetch messages"})
		return
	}

	c.JSON(200, gin.H{
		"messages": messages,
	})
}
