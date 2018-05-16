import React, { Component } from 'react';
import '../css/Crowdfunding.css';

import { Container, Header, Grid, Divider, Label, Icon, Item, Input,Comment, Rating, Loader,Progress, Responsive, Form} from 'semantic-ui-react';
import { MygrantDividerLeft, MygrantDividerRight } from './Common';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import CrowdfundingOffers from './service_offers/CrowdfundingOffers';
import Donator from './Donator';
import Comments from './comments/Comments';

const apiPath = require('../config').apiPath;
const urlForData = crowdfundingId => `http://localhost:3001/api/crowdfundings/` + crowdfundingId;
const urlForRating = crowdfundingId => `http://localhost:3001/api/crowdfundings/` + crowdfundingId + `/rating`;
const urlForDonations = crowdfundingId => `http://localhost:3001/api/crowdfundings/` + crowdfundingId  + `/donations`;
const urlForServices = crowdfundingId => `http://localhost:3001/api/crowdfundings/` + crowdfundingId + `/services`;
const urlForDonate = crowdfundingId => `http://localhost:3001/api/crowdfundings/` + crowdfundingId + `/donations`;
const urlGetDonators = crowdfundingId => `/api/crowdfundings/` + crowdfundingId + `/donations`;
const urlIsOwner = crowdfundingId => '/api/crowdfundings/' + crowdfundingId + `/is_owner`;
// TODO create,update and delete
// TODO donate

class Crowdfunding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            crowdfunding: {},
            isOwner: false,
            requestFailed: false,
            crowdfundingId: this.props.match.params.crowdfunding_id,
            donator_id: 2,
            donators: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getIsOwner() {
        const { cookies } = this.props;
        fetch(urlIsOwner(this.state.crowdfundingId), {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`,
            }
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        this.setState({isOwner: data})
                    })
            }
        })
    }

    getCrowdfundingData() {
        const { cookies } = this.props;
        fetch(urlForData(this.state.crowdfundingId), {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`,
            }
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        this.setState({crowdfunding: data});
                    })
            }
        })

        /*fetch(urlForData(this.state.crowdfundingId))
        .then(response => {
            if (!response.ok) {
                throw Error('Network request failed');
            }

            return response;
        })
        .then(result => result.json())
        .then(result => {
            this.setState({ crowdfunding: result });
        }, () => {
            // "catch" the error
            this.setState({ requestFailed: true });
        });*/
    }

    getDonators() {
        fetch(urlGetDonators(this.state.crowdfundingId), {
            method: 'GET'
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        console.log(data);
                        this.setState({donators: data});
                    })
            }
        })
    }

    getData(){
        fetch(urlForData(this.state.crowdfundingId))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(result => {
                this.setState({ crowdfunding: result });
            }, () => {
                // "catch" the error
                this.setState({ requestFailed: true });
            });
    }

    getRating(){
        fetch(urlForRating(this.state.crowdfundingId))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(result => {
                this.setState({ rating: result });
                if(!this.state.rating.average_rating){
                    this.setState({ rating: { average_rating : "No rating"}});
                }
            }, () => {
                // "catch" the error
                this.setState({ requestFailed: true });
            });
    }

    componentDidMount() {
        // DATA REQUEST
        this.getData();
        // RATING REQUEST
        this.getRating();
        // SERVICES REQUEST - TODO doesnt seem to work
        /*fetch(urlForServices(this.state.crowdfundingId))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(result => {
                this.setState({ services: result });
            }, () => {
                // "catch" the error
                this.setState({ requestFailed: true });
            });*/

        this.getIsOwner();
        this.getDonators();
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    handleSubmit = (event) => {
        const { cookies } = this.props;
        fetch(urlForDonate(this.state.crowdfundingId), {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: parseInt(this.state.amount)
            })
        }).then(res => {
            if(res.status === 201) {
                let newDonator = {
                    // TODO: correct values from cookies.
                    donator_id: 0,
                    donator_name: 'q',
                    amount: this.state.amount
                }
                let donators = this.state.donators;
                donators.push(newDonator);
                this.setState({donators: donators});

            }
        })
    }

  render() {

      if(this.state.requestFailed) {
        return (
            <Container className="main-container">
                <div>
                    <h1>Request Failed</h1>
                </div>
            </Container>
        );
      }

      if(!this.state.crowdfunding || !this.state.rating || !this.state.rating.average_rating) {
        return (
            <Container className="main-container">
            <div>
            <Loader active inline='centered' />
            </div>
            </Container>
        );
      }

      let donators;
      if(this.state.donators) {
        donators = this.state.donators.map(function(donator,index,array) {
            if( index == 0 ) {
                return (
                    <Donator donator={donator}/>
                );
            }
            return (
                <div>
                    <Divider />
                    <Donator donator={donator}/>
                </div>
            );
          });
      } else
          donators =
            <p>No donators for now</p>

      return (
        <Container className="main-container" id="crowdfunding_base_container" fluid={true}>
            <Container textAlign="center">
              <Header as="h1" id="crowdfunding_mission">Mission</Header>
            </Container>
            <Container>
                <p><strong>{this.state.crowdfunding.title}</strong> <Icon name="circle" size="tiny" flipped="horizontally"/><text>{this.state.crowdfunding.category}</text></p>
            </Container>
              <Responsive as={MygrantDividerLeft} minWidth={768} className="intro-divider" color="purple" />
              <Container>
                  <Grid stackable columns={2} className="crowdfunding_grid">
                      <Grid.Column width={6} className="left_col">
                          {/*<Image src='/assets/images/wireframe/image.png' />*/}
                          <div id="crowdfunding_progress">
                              <h5>Progress</h5>
                              <Progress progress='percentage' value={20} total={this.state.crowdfunding.mygrant_target} size="small" color='green' active={true}/>
                              <p id="crowdfunding_earned">Earned : {20}
                                <div id="crowdfunding_target">Target : {this.state.crowdfunding.mygrant_target}</div>
                              </p>
                          </div>
                      </Grid.Column>
                      <Grid.Column width={10} className="right_col">
                          <h3>Description</h3>
                          <p id="description">{this.state.crowdfunding.description}</p>
                          <p><strong>Location: </strong>{this.state.crowdfunding.location}</p>
                          <Grid columns={2}>
                              <Grid.Column width={8}>
                                  <Grid stackable columns={2} className="crowdfunding_owner">
                                      <Grid.Column width={6}>
                                          <p>Image</p>
                                      </Grid.Column>
                                      <Grid.Column width={10}>
                                          {this.state.crowdfunding.creator_name}
                                          <div id="rating">
                                              <Rating disabled icon='star' defaultRating={this.state.rating.average_rating} maxRating={5} />
                                          </div>
                                      </Grid.Column>
                                  </Grid>
                              </Grid.Column>
                              <Grid.Column width={8} align="right">
                                  <h5>Ends In</h5>
                                  <p>{new Date(this.state.crowdfunding.date_finished).toLocaleDateString()}</p>
                              </Grid.Column>
                          </Grid>

                          <Form id="crowdfunding_donate" method="POST" onSubmit={this.handleSubmit}>
                              <Form.Group widths={16}>
                                  <Form.Input width={14} type='number' placeholder='Amount' name="amount" value={this.state.amount} onChange={this.handleChange}/>
                                  <Form.Button width={2} content="donate"/>
                              </Form.Group>
                          </Form>

                      </Grid.Column>
                  </Grid>
              </Container>
            <Responsive as={MygrantDividerRight} minWidth={768} className="intro-divider" color="green" />
            <Container id="services_donators">
                <Grid stackable columns={3}>
                    <Grid.Column width={9}>
                        <CrowdfundingOffers crowdfundingId={this.state.crowdfundingId} isOwner={this.state.isOwner} />
                        {/*<h4 align="center">Services</h4>
                        <Item.Group divided>
                            <Item>
                                <Item.Image size='small' src='/assets/images/wireframe/image.png' />

                                <Item.Content verticalAlign='middle'>
                                    <Item.Header>title</Item.Header>
                                    <Item.Meta><a>category</a> <a>owner</a></Item.Meta>
                                    <Item.Description>status</Item.Description>
                                    <Item.Extra>
                                        <Button  floated="right">See Details</Button>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                            <Item>
                                <Item.Image size='small' src='/assets/images/wireframe/image.png' />

                                <Item.Content verticalAlign='middle'>
                                    <Item.Header>title</Item.Header>
                                    <Item.Meta><a>category</a> <a>owner</a></Item.Meta>
                                    <Item.Description>status</Item.Description>
                                    <Item.Extra>
                                        <Button  floated="right">See Details</Button>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                            <Item>
                                <Item.Image size='small' src='/assets/images/wireframe/image.png' />

                                <Item.Content verticalAlign='middle'>
                                    <Item.Header>title</Item.Header>
                                    <Item.Meta><a>category</a> <a>owner</a></Item.Meta>
                                    <Item.Description>status</Item.Description>
                                    <Item.Extra>
                                        <Button  floated="right">See Details</Button>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                            <Item>
                                <Item.Image size='small' src='/assets/images/wireframe/image.png' />

                                <Item.Content verticalAlign='middle'>
                                    <Item.Header>title</Item.Header>
                                    <Item.Meta><a>category</a> <a>owner</a></Item.Meta>
                                    <Item.Description>status</Item.Description>
                                    <Item.Extra>
                                        <Button  floated="right">See Details</Button>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                        </Item.Group>*/}
                    </Grid.Column>
                    <Grid.Column width={1}>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <h4 align="center">Donators</h4>
                        <Item.Group divided>
                            {donators}
                        </Item.Group>
                        {/*<h4 align="center">Donators</h4>
                        <Item.Group divided>
                            <Item>
                                <Item.Image size='tiny' src='/assets/images/wireframe/image.png' />

                                <Item.Content verticalAlign='middle'>
                                    <Item.Header>Name</Item.Header>
                                    <Item.Meta><a>rating</a> <a>value</a></Item.Meta>
                                    <Item.Description>Amount</Item.Description>
                                    <Item.Extra>
                                        <Button  floated="right">See profile</Button>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                            <Item>
                                <Item.Image size='small' src='/assets/images/wireframe/image.png' />

                                <Item.Content verticalAlign='middle'>
                                    <Item.Header>Name</Item.Header>
                                    <Item.Meta><a>rating</a> <a>value</a></Item.Meta>
                                    <Item.Description>Amount</Item.Description>
                                    <Item.Extra>
                                        <Button  floated="right">See profile</Button>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                            <Item>
                                <Item.Image size='small' src='/assets/images/wireframe/image.png' />

                                <Item.Content verticalAlign='middle'>
                                    <Item.Header>Name</Item.Header>
                                    <Item.Meta><a>rating</a> <a>value</a></Item.Meta>
                                    <Item.Description>Amount</Item.Description>
                                    <Item.Extra>
                                        <Button  floated="right">See profile</Button>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                        </Item.Group>*/}
                    </Grid.Column>
                </Grid>
            </Container>
            <Comments originField={'crowdfunding_id'} originId={this.state.crowdfundingId} />
            {/*<Container>
                <h3>Comments</h3>
            </Container>
            <Responsive as={MygrantDividerLeft} minWidth={768} className="intro-divider" color="purple" />
            <Container id="crowdfunding_comments">
                <Comment.Group>
                    <Comment>
                        <Comment.Avatar src='/assets/images/avatar/small/matt.jpg' />
                        <Comment.Content>
                            <Comment.Author as='a'>Matt</Comment.Author>
                            <Comment.Metadata>
                                <div>Today at 5:42PM</div>
                            </Comment.Metadata>
                            <Comment.Text>How artistic!</Comment.Text>
                            <Comment.Actions>
                                <Comment.Action>Reply</Comment.Action>
                            </Comment.Actions>
                        </Comment.Content>
                    </Comment>

                    <Comment>
                        <Comment.Avatar src='/assets/images/avatar/small/elliot.jpg' />
                        <Comment.Content>
                            <Comment.Author as='a'>Elliot Fu</Comment.Author>
                            <Comment.Metadata>
                                <div>Yesterday at 12:30AM</div>
                            </Comment.Metadata>
                            <Comment.Text>
                                <p>This has been very useful for my research. Thanks as well!</p>
                            </Comment.Text>
                            <Comment.Actions>
                                <Comment.Action>Reply</Comment.Action>
                            </Comment.Actions>
                        </Comment.Content>
                        <Comment.Group>
                            <Comment>
                                <Comment.Avatar src='/assets/images/avatar/small/jenny.jpg' />
                                <Comment.Content>
                                    <Comment.Author as='a'>Jenny Hess</Comment.Author>
                                    <Comment.Metadata>
                                        <div>Just now</div>
                                    </Comment.Metadata>
                                    <Comment.Text>
                                        Elliot you are always so right :)
                                    </Comment.Text>
                                    <Comment.Actions>
                                        <Comment.Action>Reply</Comment.Action>
                                    </Comment.Actions>
                                </Comment.Content>
                            </Comment>
                        </Comment.Group>
                    </Comment>

                    <Comment>
                        <Comment.Avatar src='/assets/images/avatar/small/joe.jpg' />
                        <Comment.Content>
                            <Comment.Author as='a'>Joe Henderson</Comment.Author>
                            <Comment.Metadata>
                                <div>5 days ago</div>
                            </Comment.Metadata>
                            <Comment.Text>
                                Dude, this is awesome. Thanks so much
                            </Comment.Text>
                            <Comment.Actions>
                                <Comment.Action>Reply</Comment.Action>
                            </Comment.Actions>
                        </Comment.Content>
                    </Comment>

                    <Form reply>
                        <Form.TextArea />
                        <Button content='Comment' labelPosition='left' icon='edit' primary />
                    </Form>
                </Comment.Group>
            </Container>*/}
          </Container>
      );
  }
}

export default withCookies(Crowdfunding);
