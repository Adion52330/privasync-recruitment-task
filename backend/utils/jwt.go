package utils

import (
	"os"
	"time"
	"github.com/golang-jwt/jwt/v5"
)

var Jwt_Key = []byte(os.Getenv("JWT_SECRET"))

type Claims struct {
	Username string `json: "username"`
	jwt.RegisteredClaims
}

func GenerateToken(username string) (string, error) {
	expiry := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiry),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(Jwt_Key)
}


func ValidateToken(tokenString string) (string, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return Jwt_Key, nil
	})
	if err != nil || !token.Valid {
		return "", err
	}
	return claims.Username, nil
}