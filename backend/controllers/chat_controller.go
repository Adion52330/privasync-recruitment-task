package controllers

import (
	"net/http"
	"github.com/gin-gonic/gin"

	"backend/models"
	"backend/repository"
	"backend/utils"
)

type Request struct {
	Message string `json:"message"`
	SessionID uint `json:"session_id"`
}

func Chat(c *gin.Context) {
	var req Request

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userInterface, _ := c.Get("user")
	user := userInterface.(models.User)

	var session *models.ChatSession
	var err error

	if req.SessionID == 0 {
		session, err = repository.CreateSession(user.ID, "New Chat")
		if err != nil {
			c.JSON(500, gin.H{"error": "could not create session"})
			return
		}
	} else {
		session = &models.ChatSession{ID: req.SessionID}
	}

	repository.SaveMessage(session.ID, "user", req.Message)

	response := "dummy ai reply"

	repository.SaveMessage(session.ID, "ai", response)

	c.JSON(http.StatusOK, gin.H{"session_id": session.ID, "response": response})
}

func GetSessions(c *gin.Context) {
	userInterface, _ := c.Get("user")
	user := userInterface.(models.User)
	
	sessions, err := repository.GetUserSessions(user.ID)
	if err != nil {
		c.JSON(500, gin.H{"error": "could not fetch sessions"})
		return
	}

	c.JSON(200, gin.H{
		"messages": sessions,
	})
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