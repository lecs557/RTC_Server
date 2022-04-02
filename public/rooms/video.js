class Video{
  constructor(user, stream){
    this.domElement = document.createElement("div")
    const top = document.createElement("div")
    top.innerHTML=user.name
    const bottom = document.createElement("div")
    const video = document.createElement("video")
    video.style.margin="auto"
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
     })
    this.stream = stream
    this.user = user
    this.video = video
    this.domElement.append(top)
    this.domElement.append(video)
  }


  silent(){
    this.video.muted = true
  }

  getDomElement(){
    return this.domElement
  }
}