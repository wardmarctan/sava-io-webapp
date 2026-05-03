package response

type LoginUser struct {
	Username string `json:"username"`
	Role     string `json:"role"`
}

type LoginResponse struct {
	AccessToken  string    `json:"access_token"`
	RefreshToken string    `json:"refresh_token"`
	User         LoginUser `json:"user"`
}

type MessageResponse struct {
	Message string `json:"message"`
}