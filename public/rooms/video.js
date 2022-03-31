class Video{
  constructor(stream){
    this.domElement = document.createElement("div")
    const top = document.createElement("div")
    const bottom = document.createElement("div")

    const video = document.createElement("video")
    video.style.margin="auto"
    if(stream){
      video.srcObject = stream
      video.addEventListener('loadedmetadata', () => {
        video.play()
      })
    }
    this.video = video
    this.domElement.append(top)
    this.domElement.append(video)
    this.domElement.append(bottom)
  }

  silent(){
    this.video.muted = true
  }

  getDomElement(){
    return this.domElement
  }
}