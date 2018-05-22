import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Header, Icon, Image, Segment } from 'semantic-ui-react';
import { instanceOf, PropTypes } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import moment from 'moment';

class BlogPost extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        liked: PropTypes.bool,
        linked: PropTypes.bool,
        postInfo: instanceOf(Object).isRequired,
        user: instanceOf(Object).isRequired
    };

    constructor(props) {
        super(props);
        this.state = { liked: this.props.liked };
    }

    handleLike() {

        const { cookies } = this.props;
        const headers = { Authorization: `Bearer ${cookies.get('id_token')}` };
        console.log('Like');

        // Make request to the api to add a like, and toggle like in state
        if (this.state.liked) {
        // Make request to the api to add a like, and toggle like in state
            fetch(`/api/posts/${this.props.postInfo.id}/like`, {
                headers,
                method: 'DELETE'
            })
                .then(res => {
                    this.setState({ liked: res.status === 204 })
                    console.log(this.state)
                });
        } else {
            fetch(`/api/posts/${this.props.postInfo.id}/like`, {
                headers,
                method: 'POST'
            })
                .then(res => {
                    this.setState({ liked: res.status === 201 })
                    console.log(this.state)
                });
        }

    }

    render() {
        return (
            <div>
                <Segment >
                    <Container className={`blog-post ${this.props.linked ? 'linked' : ''}`} >
                        <Grid padded >
                            <Grid.Row>
                                <Grid.Column className={'userImage'} width={2}>
                                    <Image circular src={`/api/images/${this.props.user.pictureUrl}`}/>
                                </Grid.Column>
                                <Grid.Column width={14}>
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column width={10}>
                                                <Header as={'h4'}>
                                                    {this.props.user.fullName}
                                                </Header>
                                                <Header.Subheader verticalAlign={'top'}>
                                                    {moment(this.props.postInfo.datePosted).fromNow()}
                                                </Header.Subheader>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row className={'content'} verticalAlign={'top'} >
                                            <Grid.Column width={16} >
                                                {
                                                    this.props.linked
                                                        ? <Link to={`/post/${this.props.postInfo.id}`}>{this.props.postInfo.content}</Link>
                                                        : this.props.postInfo.content }
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row textAlign={'left'}>
                                                    <Grid.Column width={2}>
                                                        <Icon name={'comment outline'}/>{this.props.postInfo.commentCount}
                                                    </Grid.Column>
                                                    <Grid.Column width={2}>
                                                        <span className={'post-likes'}
                                                            onClick={this.handleLike.bind(this)}
                                                        >
                                                            {
                                                                this.state.liked
                                                                ? <Icon className={'post-likes-icon'} color={'red'} name={'like'}/>
                                                                : <Icon className={'post-likes-icon'} name={'like outline'}/>
                                                            }
                                                            {this.props.postInfo.likes}
                                                        </span>
                                                    </Grid.Column>
                                                    <Grid.Column width={2}>
                                                        <Icon className={'post-options'} name={'ellipsis horizontal'}/>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Container>
                        </Segment>
                    </div>
        );
    }
}

export default withCookies(BlogPost);
