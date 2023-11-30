// =================================================
	// =================================================
	// Display category description
	// Web content: cat_<category name>
	// Date: 11/30/2023
	// =================================================
	// =================================================

	var g_translate_cattext = null;


	//--------------------------------------------------
	function dspCatText() {
		let timeoutvar4dspCatText;
		
		let catnameEle = $('.category-image-desc .category-name')[0];
		
		let catdescEle = $('.category-image-desc .main-container')[0];
		
		let processedEle = $('.category-image-desc .main-container .processed')[0];
		
		if (catnameEle != null  && catdescEle != null && processedEle == null) {
			
			let curCatKey = $('.category-image-desc .category-name h2').html();
			curCatKey = ("cat_" + curCatKey.replace(/ /g, "")).toUpperCase();
			console.log('current cat key: ' + curCatKey);
			
			// remove cat text from long desc.
			$('.category-image-desc .main-container .information .description').html("");
			// get and display new cat text.
			replCatText(curCatKey);
		}
		else {
			//timeoutvar4dspCatText = setTimeout(dspCatText, 250); // check again 
		}
		
		timeoutvar4dspCatText = setTimeout(dspCatText, 250); // check again 
	}




	//--------------------------------------------------
	function replCatText(curCatKey) {
		
		// Get cat text from web content
		// - - - - - - - - - - - - - - - - - - - - - - -
		// Call Liferay API to get web content for cat text
		let groupId = Liferay.ThemeDisplay.getScopeGroupId();
		let articleTitle = curCatKey;
		let returnContent = null;
		
		let processedstr = '<div class="processed" style="display:none;">' + curCatKey + '</div>';
		$('.category-image-desc .main-container').append(processedstr);
		
		$.ajax({
			type: 'GET',
			url: "/delegate/ecom-api/webcontent?articleId=" + articleTitle + "&groupId=" + groupId,
			async: true,
			success: function(data, status){
				let myJSON = JSON.stringify(data);
				
				//console.log('Using Rhythm endpoint -> web content type of data: ' + (typeof data));
								
				let jsonObj = null;
				try {
					jsonObj = JSON.parse(data);
				}
				catch(error) {
					jsonObj = data;
				}
								
				//console.log("Using Rhythm endpoint -> Translation data.content for '" + gvar + "':\n" + jsonObj.content);

				returnContent = jsonObj.content;
				
				// Extract cat text content from web content response data.
				if (returnContent != null) {
					let xmlobj = new window.DOMParser().parseFromString(returnContent, "text/html");
		
					let lc = Liferay.ThemeDisplay.getLanguageId();
					let transhtml = $(xmlobj).find("[language-id='" + lc +  "']").html();
		
					// remove <![CDATA[ and ]]>
					let xstart = transhtml.indexOf("[CDATA[");
					let xend = transhtml.indexOf("]]");

					// console.log("--  get content -> start: " + xstart + ",     end: " + xend);

					let cdata = transhtml.substring(xstart+7, xend);	
					//console.log("cat text:\n" + cdata);
					
					// replace cat text.
					let informationClassEle = $('.category-image-desc .main-container .information .description')[0];
					
					if (informationClassEle != null) {  // normal category
						$('.category-image-desc .main-container .information .description').html(cdata);
					}
					else {	// All Products page
						console.log('All Products page');
						// Adjust style
						$('.category-image-desc .main-container').attr("style", "display: block !important");
						let styledata = '<div class="description">' + cdata + '</div>';
						$('.category-image-desc .main-container .information').html(styledata);
					}
				}

			},
			error: function (jqXHR, status, err) {
				console.log("Get web content '" + articleTitle + "' not found / " + status);
			}
			
		}); // end rhythm enpoint call
		
	}
	
	
	// - - - - - - - - - - - - - - - - - - - - - - - - -
	// - - - - - - - - - - - - - - - - - - - - - - - - -
	// END OF ... Display category description
	// - - - - - - - - - - - - - - - - - - - - - - - - -
	// - - - - - - - - - - - - - - - - - - - - - - - - -
	
	
	
		// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	// Page Initialization
	$('document').ready(function(){
		
		dspCatText();
			
	});
	// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*