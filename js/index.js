var step = 2
var photo_file = ''

jQuery(document).ready(function($) {
  $('.game-step-2').hide()
})

var basic = $('.photo-crop').croppie({
  viewport: {
    width: 500,
    height: 500
  },
  mouseWheelZoom: false
})

//https://jsfiddle.net/michaelyuen/5f2wwafp/

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader()
    reader.onload = function(e) {
      basic.croppie('bind', {
        url: e.target.result
      })

      $('.col-playzone, .col-btn, .step3').hide()
      $('.game-step-2').show()
    }
    reader.readAsDataURL(input.files[0])
  }
}

$(document).delegate('.btn-next', 'click', function(event) {
  console.log({ step })
  if (step == 2) {
    // upload crop images
    basic
      .croppie('result', {
        type: 'canvas',
        size: 'viewport'
      })
      .then(function(resp) {
        $.ajax({
          url: 'uploadcrop.php',
          type: 'POST',
          data: { image: resp },
          success: function(data) {
            $('.step3').show()
            $('.step').hide()
            photo_file = data
            html = '<img src="photos/' + data + '" />'
            $('.step3 .frame-photo').html(html)
          }
        })
      })
    step = step + 1
  } else if (step == 3) {
    $.ajax({
      url: 'mergephoto.php',
      type: 'POST',
      data: { image: photo_file, yourname: $('#yourname').val() },
      success: function(data) {
        photo_file = data
        $('.col-photos img').attr('src', './photos/' + photo_file)
        $('.container').hide()
        $('.share-container').show()
      }
    })
    step = 2
  }
})

$(document).delegate('.btn-prev', 'click', function(event) {
  $('.col-playzone, .col-btn').show()
  $('.game-step-2, .step3').hide()
})

$('#imgInp').change(function() {
  readURL(this)
})

$(document).delegate('#btn-share-fb', 'click', function(event) {
  var shareDescription = $('#share-input').val()
  FB.ui(
    {
      method: 'feed',
      name: 'Facebook Dialogs',
      link: 'http://www.singhasmf.com/',
      picture: 'http://www.singhasmf.com/photos/' + photo_file,
      caption: 'ทำไมต้องดื่มสิ่งที่ใช่',
      description: shareDescription + ' #ยิ่งดื่มยิ่งใช่ #SinghaDrinkingWater #อยากเห็นคุณดื่มสิ่งที่ใช่ '
    },
    function(data) {
      console.log(response)
      if (data && data.post_id) {
        console.log({ data })
      } else {
        console.error('not sent')
      }
    }
  )

  step = 2
  photo_file = ''
  $('.share-container').hide()
  $('.register-container').show()
})
