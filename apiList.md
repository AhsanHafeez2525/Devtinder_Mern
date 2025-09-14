#Devtinder apis
authRouter
POST /signup
POST /login
POST /logout

profileRouter
GET /profile/view
PATCH /profile/edit
PATCH /profile/password

ConnectionRequestRouter

1. POST /request/send/interested/:userId
2. POST /request/send/ignored/:userId

combine 1 and 2 into one api using status dynamic
POST /request/send/:status/:userId
POST /request/review/:status/:requestId

POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId

userRouter
GET /user/connections
GET /user/requests/recieved
GET /user/feed - Gets you the profiles of other users on platform

Status: ignore(left swipe like tender), interested(right swipe like tender), accepted, rejected
