import React, { Component } from 'react';
import { Button, Grid, Header, Icon, Image, Segment, Responsive } from 'semantic-ui-react';
import { instanceOf } from 'prop-types';

class BlogHeader extends Component {
    static propTypes = { user: instanceOf(Object).isRequired };

    render() {
        return (
            <div className="blog-header">
                <Responsive as={Image} minWidth={768} centered circular src={`/api/images/${this.props.user.pictureUrl}`}/>
                <Segment textAlign={'left'}>
                    <Grid padded >
                        <Grid.Row>
                            <Responsive as={Grid.Column} minWidth={768} width={8}>
                                <Header as={'h1'}>{this.props.user.fullName}</Header>
                            </Responsive>
                            <Responsive as={Grid.Column} maxWidth={768} width={4}>
                                <Image size={'tiny'} circular src={`/api/images/${this.props.user.pictureUrl}`}/>
                            </Responsive>
                            <Responsive as={Grid.Column} maxWidth={768} textAlign={'left'} verticalAlign={'bottom'} width={12}>
                                <Header as={'h1'}>{this.props.user.fullName}</Header>
                            </Responsive>
                            <Responsive as={Grid.Column} minWidth={768} textAlign={'right'} width={8} floated={'right'} >
                                <Header.Subheader>{`${this.props.user.postCount} posts`}</Header.Subheader>
                            </Responsive>
                        </Grid.Row>
                        <Grid.Row>
                            <Responsive as={Grid.Column} maxWidth={768} width={8}>
                                <Header.Subheader>{`${this.props.user.city}, ${this.props.user.country}`}</Header.Subheader>
                                <Header.Subheader>{`${this.props.user.postCount} posts`}</Header.Subheader>
                            </Responsive>
                            <Responsive as={Grid.Column} minWidth={768} width={8} >
                                <Header.Subheader>{`${this.props.user.city}, ${this.props.user.country}`}</Header.Subheader>
                            </Responsive>
                            <Grid.Column textAlign={'right'} width={8} floated={'right'} >
                                <Button compact size={'mini'} floated={'right'}><Icon name={'plus'} size={'mini'}/>{'Add friend'.toUpperCase()}</Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
        );
    }
}

export default BlogHeader;
