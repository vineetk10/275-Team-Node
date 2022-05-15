function DownloadFile(call) {
    let videoDataStream = fs.createReadStream('./sample.mp4');
    videoDataStream.on('data',function(chunk){
        console.log({videoStream: chunk});
        call.write({videoStream: chunk});
    }).on('end',function(){
        call.end();
    })
  
}

exports.DownloadFile = DownloadFile;