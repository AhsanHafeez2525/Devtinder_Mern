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
POST /request/send/interested/:userId
POST /request/send/ignored/:userId
POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId

userRouter
GET /user/connections
GET /user/requests/recieved
GET /user/feed - Gets you the profiles of other users on platform

Status: ignore(left swipe like tender), interested(right swipe like tender), accepted, rejected
