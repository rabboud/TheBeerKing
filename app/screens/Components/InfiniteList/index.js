import React from 'react';

class InfiniteList extends React.Component {
    constructor (props) {
        super(props);
    }

    componentDidMount () {
        this.list.addEventListener('scroll', this._handleScroll.bind(this));
        this.firstSize = this.list.scrollHeight;
        this.firstScroll = false;
    }

    componentDidUpdate () {
        if (this.props.autoScrollDown) {
            if (this.isOnEnd) {
                this._scrollDown();
            }
        }

        if (this.props.startOnBottom && !this.firstSroll) {
            if (this.firstSize !== this.list.scrollHeight) {
                this._scrollDown();
                this.firstSize = this.list.scrollHeight;
                this.firstSroll = true;
            }
        }
    }

    _scrollDown () {
        this.list.scrollTop = this.list.scrollHeight;
    }

    _handleScroll () {
        this.isOnEnd = (this.list.scrollTop + this.list.offsetHeight) === this.list.scrollHeight;

        if (!this.list.scrollTop) {
            if (this.props.handleTopList) {
                this.props.handleTopList();
            }
        }

        if (this.isOnEnd) {
            if (this.props.handleBottomList) {
                this.props.handleBottomList();
            }
        }
    }

    render () {
        const getMainWraper = () => {
            switch (this.props.type) {
                case 'table':
                    return (
                        <div
                            className={`InfiniteList ${this.props.className || ''}`}
                            data-scroll={this.props.scrollDirection}
                            data-type={this.props.type}
                            ref={(c) => {this.list = c;}}
                        >
                            {this.props.children}
                        </div>
                    );
                default:
                    return (
                        <ul
                            className={`InfiniteList ${this.props.className || ''}`}
                            data-scroll={this.props.scrollDirection}
                            data-type={this.props.type}
                            ref={(c) => {this.list = c;}}
                        >
                            {this.props.children}
                        </ul>
                    );
            }
        };

        return (getMainWraper());
    }
}

InfiniteList.PropTypes = {
    type: React.PropTypes.string,
    className: React.PropTypes.string,
    autoScrollDown: React.PropTypes.bool,
    startOnBottom: React.PropTypes.bool,
    scrollDirection: React.PropTypes.string,
    handleTopList: React.PropTypes.func,
    handleBottomList: React.PropTypes.func
};

export default InfiniteList;
