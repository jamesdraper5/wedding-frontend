import ko from 'knockout';
import homeTemplate from 'text!./home.html';

class HomeViewModel {
    constructor(route) {
        this.installation = app.installation;
        this.showAdmin = ko.observable(route.showAdmin || false);

        this.listenToInput();
    }

    OnRendered() {
    	//ko.postbox.publish('home-page-rendered');

    	if ( app.hasSidebar() ) {
    		setTimeout(() => {
	    		app.sidebarPosition('open');
    		}, 500);
    	}
    }

    listenToInput() {
	    document.getElementById("file-input").onchange = () => {
	        const files = document.getElementById('file-input').files;
	        const file = files[0];
	        if(file == null){
	          return alert('No file selected.');
	        }
	        this.getSignedRequest(file);
	    }
    }

    getSignedRequest(file) {
      	const xhr = new XMLHttpRequest();
      	xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
      	xhr.onreadystatechange = () => {
        	if(xhr.readyState === 4){
          		if(xhr.status === 200){
            		const response = JSON.parse(xhr.responseText);
            		this.uploadFile(file, response.signedRequest, response.url);
          		} else {
		            alert('Could not get signed URL.');
	            }
        	}
      	};
      	xhr.send();
    }

    uploadFile(file, signedRequest, url){
		const xhr = new XMLHttpRequest();
		xhr.open('PUT', signedRequest);
		xhr.onreadystatechange = () => {
        	if(xhr.readyState === 4){
          		if(xhr.status === 200){
            		document.getElementById('preview').src = url;
            		document.getElementById('avatar-url').value = url;
          		} else {
            		alert('Could not upload file.');
          		}
        	}
      	};
	    xhr.send(file);
    }

}

export default { viewModel: HomeViewModel, template: homeTemplate };
