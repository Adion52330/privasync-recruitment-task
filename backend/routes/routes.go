package routes

import (
	"github.com/gin-gonic/gin"
	"backend/middleware"
	"backend/controllers"
)

func RegisterRoutes(r *gin.Engine) {
	r.POST("/signup", controllers.Signup)
	r.POST("/login", controllers.Login)

	authed := r.Group("/")
	authed.Use(middleware.AuthMiddleware())
	authed.GET("/me", controllers.CurrentUser)
	authed.POST("/chat", controllers.Chat)
	authed.GET("/sessions", controllers.GetSessions)
	authed.GET("/sessions/:id/messages", controllers.GetMessages)
}
