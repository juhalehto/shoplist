import React from 'react';

class NotifyModal extends React.Component {

    render() {

        if(!this.props.Show) {
          return null;
        }
    
        return (
            <div className="ModalBackdrop">
                <div className="ModalWindow">
                    <p>
                        {this.props.Text}
                    </p>
                </div>
            </div>
        );
    }
} 



export default NotifyModal;
