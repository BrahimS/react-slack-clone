import Chatkit from 'pusher-chatkit-client'

const credentials = {
  url:
    'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/05f46048-3763-4482-9cfe-51ff327c3f29/token?instance_locator=v1:us1:05f46048-3763-4482-9cfe-51ff327c3f29',
  instanceLocator: 'v1:us1:05f46048-3763-4482-9cfe-51ff327c3f29',
}

const { instanceLocator, url } = credentials
export default ({ state, actions }, userId) =>
  new Chatkit.ChatManager({
    tokenProvider: new Chatkit.TokenProvider({ url }),
    instanceLocator,
    userId,
  })
    .connect({
      userStartedTyping: (room, user) => actions.isTyping([user.id, room]),
      userStoppedTyping: (room, user) => actions.notTyping(user.id),
      userCameOnline: user => actions.setUserPresence([user.id, true]),
      userWentOffline: user => actions.setUserPresence([user.id, false]),
      addedToRoom: actions.addRoom,
    })
    .then(user => {
      actions.setUser(user)
      user.getAllRooms().then(rooms => {
        actions.setRooms(rooms)
        actions.joinRoom(rooms.find(x => x.userIds.length !== 100))
      })
    })
    .catch(error => console.log('Error on connection', error))