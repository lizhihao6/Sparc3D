// This is based on: http://thenewcode.com/364/Interactive-Before-and-After-Video-Comparison-in-HTML5-Canvas
// With additional modifications based on: https://jsfiddle.net/7sk5k4gp/13/

function playVids(videoIds) {
    function drawLoop() {
        var colStart = (vidWidth * position).clamp(0.0, vidWidth);
        var colWidth = (vidWidth - (vidWidth * position)).clamp(0.0, vidWidth);

        for (var i = 0; i < mergeContexts.length; i++) {
            mergeContexts[i].drawImage(vids[i], 0, 0, vidWidth, vidHeight, 0, 0, vidWidth, vidHeight);
            mergeContexts[i].drawImage(vids[i], colStart + vidWidth, 0, colWidth, vidHeight, colStart, 0, colWidth, vidHeight);
        }
        requestAnimationFrame(drawLoop);


        var arrowLength = 0.09 * vidWidth;
        var arrowheadWidth = 0.025 * vidWidth;
        var arrowheadLength = 0.04 * vidWidth;
        var arrowPosY = vidHeight / 2;
        var arrowWidth = 0.007 * vidWidth;
        var currX = vidWidth * position;

        for (var mergeContext of [mergeContexts[0]]) {
            // Draw circle
            // mergeContext.arc(currX, arrowPosY, arrowLength * 0.7, 0, Math.PI * 2, false);
            // mergeContext.arc(currX, arrowPosY, vidWidth*0.04, 0, Math.PI * 2, false);
            mergeContext.arc(currX, arrowPosY, vidWidth*0.045, 0, Math.PI * 2, false);
            mergeContext.fillStyle = "#ffd793af";
            // mergeContext.fillStyle = "#8ccce7ca";
            // mergeContext.fillStyle = "#b6e59695";
            mergeContext.fill()
            //mergeContext.strokeStyle = "#444444";
            //mergeContext.stroke()

            // Draw border
            mergeContext.beginPath();
            mergeContext.moveTo(vidWidth * position, 0);
            mergeContext.lineTo(vidWidth * position, vidHeight);
            mergeContext.closePath()
            // mergeContext.strokeStyle = "#444444";
            mergeContext.strokeStyle = "#21212195";
            mergeContext.lineWidth = vidWidth / 200;
            mergeContext.stroke();

            // Draw arrow
            mergeContext.beginPath();
            mergeContext.moveTo(currX, arrowPosY - arrowWidth / 2);

            // Move right until meeting arrow head
            mergeContext.lineTo(currX + arrowLength / 2 - arrowheadLength / 2, arrowPosY - arrowWidth / 2);

            // Draw right arrow head
            mergeContext.lineTo(currX + arrowLength / 2 - arrowheadLength / 2, arrowPosY - arrowheadWidth / 2);
            mergeContext.lineTo(currX + arrowLength / 2, arrowPosY);
            mergeContext.lineTo(currX + arrowLength / 2 - arrowheadLength / 2, arrowPosY + arrowheadWidth / 2);
            mergeContext.lineTo(currX + arrowLength / 2 - arrowheadLength / 2, arrowPosY + arrowWidth / 2);

            // Go back to the left until meeting left arrow head
            mergeContext.lineTo(currX - arrowLength / 2 + arrowheadLength / 2, arrowPosY + arrowWidth / 2);

            // Draw left arrow head
            mergeContext.lineTo(currX - arrowLength / 2 + arrowheadLength / 2, arrowPosY + arrowheadWidth / 2);
            mergeContext.lineTo(currX - arrowLength / 2, arrowPosY);
            mergeContext.lineTo(currX - arrowLength / 2 + arrowheadLength / 2, arrowPosY - arrowheadWidth / 2);
            mergeContext.lineTo(currX - arrowLength / 2 + arrowheadLength / 2, arrowPosY);

            mergeContext.lineTo(currX - arrowLength / 2 + arrowheadLength / 2, arrowPosY - arrowWidth / 2);
            mergeContext.lineTo(currX, arrowPosY - arrowWidth / 2);

            mergeContext.closePath();

            mergeContext.fillStyle = "#565656";
            mergeContext.fill();
        }

    }
    var videoMerges = [];
    var mergeContexts = [];
    var vids = [];
    for (const videoId of videoIds) {
        var element = document.getElementById(videoId + "Merge");
        
        videoMerges.push(document.getElementById(videoId + "Merge"));
        vids.push(document.getElementById(videoId));
        mergeContexts.push(element.getContext("2d"));
    }
    var position = 0.5;
    var vidWidth = vids[0].videoWidth / 2;
    var vidHeight = vids[0].videoHeight;

    for (const vid of vids){
        if (vid.readyState > 3) {
            vid.play();
        }
    }

    for (const videoMerge of [videoMerges[0]]) {
        function trackLocation(e) {
            // Normalize to [0, 1]
            bcr = videoMerge.getBoundingClientRect();
            position = ((e.pageX - bcr.x) / bcr.width);
            position = position % 1
        }
        function trackLocationTouch(e) {
            // Normalize to [0, 1]
            bcr = videoMerge.getBoundingClientRect();
            position = ((e.touches[0].pageX - bcr.x) / bcr.width);
            position = position % 1
        }

        videoMerge.addEventListener("mousemove", trackLocation, false);
        videoMerge.addEventListener("touchstart", trackLocationTouch, false);
        videoMerge.addEventListener("touchmove", trackLocationTouch, false);
    
    }
    requestAnimationFrame(drawLoop);

}

Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
};

// 修改后的 preprocess 函数
function preprocess(element) {
    return new Promise((resolve) => {
        const canvasId = element.id + "Merge";  // 注意这里改为 Merge 而不是 _merge
        const cv = document.getElementById(canvasId);
        
        if (!cv) {
            console.error("Canvas not found:", canvasId);
            return resolve(element);
        }

        // 确保视频元数据已加载
        if (element.readyState >= 2) { // HAVE_METADATA
            updateCanvasSize();
        } else {
            element.onloadedmetadata = updateCanvasSize;
        }

        function updateCanvasSize() {
            cv.width = element.videoWidth / 2;
            cv.height = element.videoHeight;
            element.play();
            element.style.height = "0px";
            resolve(element);
        }
    });
}

// 修改后的 resizeAndPlay 函数
async function resizeAndPlay(element, videoIds = null) {
    try {
        element = await preprocess(element);
        const all_videoIds = [element.id];
        
        if (videoIds) {
            for (const videoId of videoIds) {
                const newElement = document.getElementById(videoId);
                if (newElement) {
                    await preprocess(newElement);
                    all_videoIds.push(newElement.id);
                }
            }
        }
        playVids(all_videoIds);
    } catch (error) {
        console.error("Error in resizeAndPlay:", error);
    }
}
function preprocess2(element) {
    var cv = document.getElementById(element.id + "_merge");
    cv.width = element.videoWidth / 2;
    cv.height = element.videoHeight;

    // console.log("video height:" + element.videoHeight)
    // console.log("video width:" + element.videoWidth)

    element.play();
    element.style.height = "0px";  // Hide video without stopping it
    return element
}

async function resizeAndPlay2(element, videoIds = null) {
    // wait for the real element back from preprocess()
    element = await preprocess(element);

    const all_videoIds = [element.id];
    if (videoIds) {
      for (const videoId of videoIds) {
        let newEl = document.getElementById(videoId);
        newEl = await preprocess(newEl);
        all_videoIds.push(newEl.id);
      }
    }

    // console.log(all_videoIds);
    playVids(all_videoIds);
}