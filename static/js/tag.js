import { setupImageWall } from 'static/js/components/image-wall.js'
const tagId = window.location.pathname.split('/').pop();

setupImageWall(`tag/${ tagId }`)
