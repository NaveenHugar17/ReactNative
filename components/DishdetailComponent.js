import React, { Component } from 'react';
import { Text, View, ScrollView,StyleSheet, FlatList,Modal, Button} from 'react-native';
import { Card,Icon,Input,Rating } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite,postComment } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId,rating,author,comment) => dispatch(postComment(dishId,rating,author,comment))
})

function RenderDish(props) {

    const dish = props.dish;
    
        if (dish != null) {
            return(
                <Card
                    featuredTitle={dish.name}
                    image={{uri: baseUrl + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style={styles.iconsRow}>
                    <Icon 
                        raised
                        reverse
                        name={ props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                        />
                    <Icon 
                        raised
                        reverse
                        name='pencil'
                        type='font-awesome'
                        color='#512DA8'
                        onPress={() => props.toggleModal()}
                        />
                    </View>
            </Card>
            );
        }
        else {
            return(<View></View>);
        }
}

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal:false,
            rating:3,
            author:'', 
            message:''
        };
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    toggleModal(){
        this.setState({showModal:!this.state.showModal})
    }

    resetState(){
        this.setState({
            rating:5,
            author:'', 
            message:''
        });
    }

    handleComment(){
        const dishId = this.props.navigation.getParam("dishId", "");
        this.props.postComment(dishId,this.state.rating,this.state.author,this.state.message);
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    toggleModal={()=> this.toggleModal()} 
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal animationType = {"slide"} transparent = {false}
                    visible = {this.state.showModal}
                    onDismiss = {() => this.toggleModal() }
                    onRequestClose = {() => this.toggleModal() }>
                    <View style = {styles.modal}> 
                        <Rating
                            type='star'
                            ratingCount={5}
                            imageSize={50}
                            showRating
                            onFinishRating={(rating)=>this.setState({rating:rating})}
                            /> 
                        <Input
                            placeholder='Author'
                            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                            onChangeText={value => this.setState({ author: value })}
                            />
                        <Input
                            placeholder='Comment'
                            leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                            onChangeText={value => this.setState({ message: value })}
                            />  
                        <Button 
                            onPress = {() =>{this.handleComment();this.toggleModal();}}
                            color="#512DA8"
                            title="Submit" 
                            />
                        <Text></Text>            
                        <Button 
                            onPress = {() =>{this.toggleModal()}}
                            color="#797D7F"
                            title="Close" 
                            />
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 20
     },
     modalTitle: {
         fontSize: 24,
         fontWeight: 'bold',
         backgroundColor: '#512DA8',
         textAlign: 'center',
         color: 'white',
         marginBottom: 20
     },
     modalText: {
         fontSize: 18,
         margin: 10
     },
     iconsRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
      }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);