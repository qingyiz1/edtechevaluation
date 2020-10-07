/*eslint-disable*/
import $ from "jquery";
import { saveAs } from "file-saver";
import * as firebase from 'firebase/app'
//导入js文件
//let saveAs = require('./FileSaver')
//let $ = require('./jquery')
function getBase64Image(img, imageSize = {width: 150, height: 150}) { 
  const {width, height} = imageSize 
  var canvas = document.createElement("canvas");  
  canvas.width = width;
  canvas.height = height;  
  var ctx = canvas.getContext("2d");  
  ctx.drawImage(img, 0, 0, width, height);  
  var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();  
  var dataURL = canvas.toDataURL("image/"+ext);  
  return dataURL;
}  

export default function wordExport(content, fileName, styles,repId) {
  fileName = typeof fileName !== "undefined" ? fileName : "jQuery-Word-Export";
  var static_ = {
    mhtml: {
      top:
        "Mime-Version: 1.0\nContent-Base: " +
        location.href +
        '\nContent-Type: Multipart/related; boundary="NEXT.ITEM-BOUNDARY";type="text/html"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset="utf-8"\nContent-Location: ' +
        location.href +
        "\n\n<!DOCTYPE html>\n<html>\nxmlns:v='urn:schemas-microsoft-com:vml'xmlns:o='urn:schemas-microsoft-com:office:office'xmlns:w='urn:schemas-microsoft-com:office:word'xmlns:m='http://schemas.microsoft.com/office/2004/12/omml'xmlns='http://www.w3.org/TR/REC-html40'  xmlns='http://www.w3.org/1999/xhtml'\n_html_</html>",
      head:
        '<head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n<style>\n_styles_\n</style>\n<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:TrackMoves>false</w:TrackMoves><w:TrackFormatting/><w:ValidateAgainstSchemas/><w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid><w:IgnoreMixedContent>false</w:IgnoreMixedContent><w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText><w:DoNotPromoteQF/><w:LidThemeOther>EN-US</w:LidThemeOther><w:LidThemeAsian>ZH-CN</w:LidThemeAsian><w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript><w:Compatibility><w:BreakWrappedTables/><w:SnapToGridInCell/><w:WrapTextWithPunct/><w:UseAsianBreakRules/><w:DontGrowAutofit/><w:SplitPgBreakAndParaMark/><w:DontVertAlignCellWithSp/><w:DontBreakConstrainedForcedTables/><w:DontVertAlignInTxbx/><w:Word11KerningPairs/><w:CachedColBalance/><w:UseFELayout/></w:Compatibility><w:BrowserLevel>MicrosoftInternetExplorer4</w:BrowserLevel><m:mathPr><m:mathFont m:val="Cambria Math"/><m:brkBin m:val="before"/><m:brkBinSub m:val="--"/><m:smallFrac m:val="off"/><m:dispDef/><m:lMargin m:val="0"/> <m:rMargin m:val="0"/><m:defJc m:val="centerGroup"/><m:wrapIndent m:val="1440"/><m:intLim m:val="subSup"/><m:naryLim m:val="undOvr"/></m:mathPr></w:WordDocument></xml><![endif]--></head>\n',
      body: "<body>_body_</body>"
    }
  };
  
  var options = {
    maxWidth: 624
  };
  // Clone selected element before manipulating it
  var markup = content.clone();

  // Remove hidden elements from the output
  markup.each(function() {
    var self = content;
    if (self.is(":hidden")) self.remove();
  });

  // Embed all images using Data URLs
  var images = Array();
  var img = markup.find("img");
  for (let i = 0; i < img.length; i++) {
    var element = img[i];
    var uri = getBase64Image(element);
    // element.src = base64Img
    // images.push(base64Img)
    images[i] = {
      type: uri.substring(uri.indexOf(":") + 1, uri.indexOf(";")),
      encoding: uri.substring(uri.indexOf(";") + 1, uri.indexOf(",")),
      location: $(img[i]).attr("src"),
      data: uri.substring(uri.indexOf(",") + 1)
    }
  }
  // for (var i = 0; i < img.length; i++) {
  //   //如果导出的word文件里面包含线上的图片
  //   // Calculate dimensions of output image
  //   var width = Math.min(img[i].width, options.maxWidth);
  //   var height = img[i].height * (width / img[i].width);
  //   // Create canvas for converting image to data URL
  //   //这是添加的代码--------------------------------------------
  //   var img_id = "#" + img[i].id;
  //   $("<canvas>")
  //     .attr("id", "test_word_img_" + i)
  //     .width(width)
  //     .height(height)
  //     .insertAfter(img_id);
  // }

  // Prepare bottom of mhtml file with image data
  var mhtmlBottom = "\n";
  for (var i = 0; i < images.length; i++) {
    mhtmlBottom += "--NEXT.ITEM-BOUNDARY\n";
    mhtmlBottom += "Content-Location: " + images[i].location + "\n";
    mhtmlBottom += "Content-Type: " + images[i].type + "\n";
    mhtmlBottom += "Content-Transfer-Encoding: " + images[i].encoding + "\n\n";
    mhtmlBottom += images[i].data + "\n\n";
  }
  mhtmlBottom += "--NEXT.ITEM-BOUNDARY--";

  // Aggregate parts of the file together
  var fileContent =
    static_.mhtml.top.replace(
      "_html_",
      static_.mhtml.head.replace("_styles_", styles) +
        static_.mhtml.body.replace("_body_", markup.html())
    ) + mhtmlBottom;
  // Create a Blob with the file contents
  var blob = new Blob([fileContent], {
    type: "application/msword;charset=utf-8"
  });
  saveAs.saveAs(blob, fileName + ".doc");
  //upload file
  let id = repId;
  var storageRef = firebase.storage().ref()
  var repRef = storageRef.child('Report/'+id+ '.doc')

  repRef.put(blob)
}