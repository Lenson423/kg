const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

upload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
});


document.getElementById('contrastButton').addEventListener('click', () => {
    const src = cv.imread(canvas);
    const dst = new cv.Mat();

    cv.convertScaleAbs(src, dst, 1.5, 0); // alpha=1.5, beta=0
    cv.imshow(canvas, dst);
    
    src.delete();
    dst.delete();
});

document.getElementById('rgbHistogramEqualization').addEventListener('click', () => {
    const src = cv.imread(canvas);
    const dst = new cv.Mat();
    
    const channels = new cv.MatVector();
    cv.split(src, channels);
    
    for (let i = 0; i < channels.size(); i++) {
        cv.equalizeHist(channels.get(i), channels.get(i));
    }
    
    cv.merge(channels, dst);
    cv.imshow(canvas, dst);
    
    src.delete();
    dst.delete();
    channels.delete();
});

document.getElementById('hsvHistogramEqualization').addEventListener('click', () => {
    const src = cv.imread(canvas);
    const dst = new cv.Mat();

    cv.cvtColor(src, dst, cv.COLOR_RGBA2RGB);
    cv.cvtColor(dst, dst, cv.COLOR_RGB2HSV);
    
    const channels = new cv.MatVector();
    cv.split(dst, channels);
    cv.equalizeHist(channels.get(2), channels.get(2));
    
    cv.merge(channels, dst);
    cv.cvtColor(dst, dst, cv.COLOR_HSV2RGB);
    cv.cvtColor(dst, dst, cv.COLOR_RGB2RGBA);
    cv.imshow(canvas, dst);
    
    src.delete();
    dst.delete();
    channels.delete();
});

document.getElementById('addConstant').addEventListener('click', () => {
    const src = cv.imread(canvas);
    const dst = new cv.Mat();
    
    const constantValue = new cv.Mat(src.rows, src.cols, src.type(), [50, 50, 50, 0]);
    cv.add(src, constantValue, dst);

    cv.imshow(canvas, dst);

    src.delete();
    dst.delete();
    constantValue.delete();
});

document.getElementById('negative').addEventListener('click', () => {
    const src = cv.imread(canvas);
    const dst = new cv.Mat();
    
    cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);
    cv.bitwise_not(src, dst);    
    cv.imshow(canvas, dst);

    src.delete();
    dst.delete();
});

document.getElementById('multiplyConstant').addEventListener('click', () => {
    const src = cv.imread(canvas);
    const dst = new cv.Mat();
    
    const constantValue = new cv.Mat(src.rows, src.cols, src.type(), [2, 2, 2, 1]);
    cv.multiply(src, constantValue, dst);    
    cv.imshow(canvas, dst);

    src.delete();
    dst.delete();
    constantValue.delete();
});


document.getElementById('power').addEventListener('click', () => {
    const src = cv.imread(canvas);
    const dst = new cv.Mat();
    src.convertTo(dst, cv.CV_32F);
    
    cv.pow(dst, 1.25, dst);
    cv.normalize(dst, dst, 0, 255, cv.NORM_MINMAX);
    dst.convertTo(dst, cv.CV_8U);
    cv.imshow(canvas, dst);
    
    src.delete();
    dst.delete();
});

document.getElementById('logarithm').addEventListener('click', () => {
    const src = cv.imread(canvas);
    const dst = new cv.Mat();
    src.convertTo(dst, cv.CV_32F);
    
    cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);
    let ones = new cv.Mat(dst.rows, dst.cols, dst.type(), new cv.Scalar(1, 1, 1, 0));
    cv.add(dst, ones, dst);
    cv.log(dst, dst);

    cv.normalize(dst, dst, 0, 255, cv.NORM_MINMAX);
    dst.convertTo(dst, cv.CV_8U);
    cv.imshow(canvas, dst);

    src.delete();
    dst.delete();
});