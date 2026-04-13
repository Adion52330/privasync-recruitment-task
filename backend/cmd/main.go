package main

import (
	"log"
	"time"
	"github.com/joho/godotenv"
	"backend/config"
	"backend/models"
	"github.com/gin-gonic/gin"
	"backend/routes"
	"github.com/gin-contrib/cors"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No env file found")
	}

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	config.ConnectDatabase()
	config.DB.AutoMigrate(&models.User{}, &models.ChatSession{}, &models.Message{})

	routes.RegisterRoutes(r)

	r.Run(":8000")
}
