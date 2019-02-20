import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, Image, Alert} from 'react-native';
import {getCFPFromBarcode, getEquivFromCFP} from '../API/mushuBackend';
import OupsScreen from './Common/Oups';
import Loader from './Common/Loader';
import Icon from 'react-native-vector-icons/FontAwesome';
import NumericInput from 'react-native-numeric-input';
import Emoji from 'react-native-emoji';
import UserService from '../Services/UserService'
import ProductService from '../Services/ProductService';
import BasketService from '../Services/BasketService';
import {todayTimeStamp} from '../Helper/basketHelper';
import {mainColor} from '../Navigation/HeaderStyle';


class ProductScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productInfo: undefined,
            equivalent: undefined,
            isLoading: true,
            isConnected: true,
            fromHistory: this.props.navigation.getParam('fromHistory'),
            fromBasket: !!this.props.navigation.getParam('basketTimestamp'),
            basketTimestamp: this.props.navigation.getParam('basketTimestamp') ? this.props.navigation.getParam('basketTimestamp') : todayTimeStamp(),
            // hasCheckedAllergies: false,
            quantityInBasket: 0,
            cartCounter: 1,
        };
    }

    componentDidMount() {
        const barcode = this.props.navigation.getParam('barcode');
        this.setState({quantityInBasket: BasketService.findProductQuantityInBasket(this.state.basketTimestamp, barcode)});
        getCFPFromBarcode(barcode)
            .then(data => {
                console.log(data);
                this.setState({
                    productInfo: data,
                });

                // TODO: get reall cfp with quantity
                getEquivFromCFP(10).then((equiv) => {
                    console.log(equiv);
                    this.setState({
                        equivalent: equiv,
                        isLoading: false
                    })
                    //TODO: save product in DB

                    // if (this.props.navigation.getParam('update') && Object.keys(this.state.productInfo).length > 0) {
                    //     let product = ProductService.findProduct(data, this.props.navigation.getParam('barcode'));
                    //     ProductService.scan(product);
                    // }
                })
            })
            .catch((error) => {
                    console.log(error);
                    this.setState({isConnected: false, isLoading: false})
                }
            );

        // const cfpPromise = getCFPFromBarcode(barcode);
        // const equivPromise = getEquivFromCFP(cfp);
        // Promise.all([promise1, promise2, promise3]).then(function (values) {
        //     console.log(values);
        // });
    }

    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <Loader/>
            );
        }
    }

    /**
     * Input: string of ingredients with allergens
     * Output: JSX corresponding to the <Text> with allergens in bold
     */
    // static _parseIngredientWithAllergens(ingredientsWithAllergens) {
    //     if (!ingredientsWithAllergens) {
    //         return (<Text style={styles.defaultText}>Non renseigné</Text>)
    //     } else {
    //         const splitedIngredients = ingredientsWithAllergens.split(/<span class=\"allergen\">|<\/span>/);
    //
    //         return (
    //             <Text style={styles.defaultText}>
    //                 {splitedIngredients.map((value, index) => {
    //                     if (index % 2 === 1) {
    //                         return (
    //                             <Text style={{fontWeight: 'bold'}} key={index}>{value}</Text>
    //                         )
    //                     } else {
    //                         return (
    //                             <Text key={index}>{value}</Text>
    //                         )
    //                     }
    //                 })}
    //             </Text>
    //         )
    //     }
    // }

    /**
     * Generate JSX for allergens
     */
    // static _parseAllergens(allergens) {
    //     if (!allergens) {
    //         return (<View></View>);
    //     } else {
    //         return (
    //             <View>
    //                 <Text style={styles.titleText}>Allergènes</Text>
    //                 <Text style={styles.defaultText}>{allergens}</Text>
    //             </View>
    //         )
    //     }
    // }

    _addProductToCart() {
        BasketService.addProductToBasket(this.state.basketTimestamp, this.state.product, this.state.cartCounter);
        this.setState({quantityInBasket: this.state.cartCounter});
    }

    _removeProductFromCart() {
        BasketService.deleteProductFromBasket(this.state.basketTimestamp, this.state.product._id);
        this.setState({quantityInBasket: 0, cartCounter: this.state.quantityInBasket});
    }

    /**
     * Generate JSX for adding product to cart or remove it from cart
     */
    _printBasketOptions() {
        if (!this.state.fromHistory) {
            if (this.state.quantityInBasket > 0) {
                return (
                    <View style={styles.borderTop}>
                        <Text style={{textAlign: "center", marginTop: 10}}>
                            Supprimer l'article du panier
                        </Text>
                        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: 20}}>{this.state.quantityInBasket}</Text>
                            <View style={styles.cartButton}>
                                <Icon.Button
                                    name="trash"
                                    size={50}
                                    color="#00C378"
                                    backgroundColor="transparent"
                                    underlayColor="transparent"
                                    onPress={() => {
                                        this._removeProductFromCart();
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                )
            } else {
                return (
                    <View style={styles.borderTop}>
                        <Text style={{textAlign: "center", marginTop: 10}}>
                            Ajoute cet article à ton panier d'aujourd'hui <Emoji name={"wink"}/>
                        </Text>
                        <View style={{flexDirection: "row", justifyContent: "center"}}>
                            <View style={[styles.cartButton, {marginTop: 12}]}>
                                <NumericInput
                                    minValue={1}
                                    initValue={this.state.cartCounter}
                                    onChange={value => this.setState({cartCounter: value})}
                                />
                            </View>
                            <View style={styles.cartButton}>
                                <Icon.Button
                                    name="cart-arrow-down"
                                    size={50}
                                    color="#00C378"
                                    backgroundColor="transparent"
                                    underlayColor="transparent"
                                    onPress={() => {
                                        this._addProductToCart();
                                    }
                                    }
                                />
                            </View>
                        </View>
                    </View>
                )
            }
        } else {
            return;
        }
    }

    _displayProductInfo() {
        // TODO: add cfp info
        // TODO: add recommandations
        // TODO: add equivalent carbone

        const {productInfo, isLoading, isConnected, equivalent} = this.state;

        if (!isLoading) {
            if (productInfo && Object.keys(productInfo).length > 0 && equivalent) {
                return (
                    <ScrollView style={styles.scrollviewContainer}>
                        <View style={styles.headerContainer}>
                            <Image
                                style={styles.imageProduct}
                                source={productInfo.image_url ? {uri: productInfo.image_url} : require('../assets/images/No-images-placeholder.png')}
                            />
                            <View style={styles.headerDescription}>
                                <Text
                                    style={styles.productNameText}>{productInfo.name ? productInfo.name : "Nom inconnu"}</Text>
                                <Text style={styles.defaultText}>Quantité
                                    : {productInfo.quantity_string ? productInfo.quantity_string : "Non renseignée"}</Text>
                                {/*TODO: print barcode*/}
                                {/*<Text style={styles.descriptionText}>Code barre : {product._id}</Text>*/}
                            </View>
                        </View>

                        {/*<Text style={styles.titleText}>Catégories</Text>*/}

                        {/*<Text*/}
                        {/*style={styles.defaultText}>{product.categories ? product.categories : "Non renseigné"}*/}
                        {/*</Text>*/}
                        <Text style={styles.cfpText}>Empreinte carbone : {productInfo.value.toFixed(2)}</Text>


                        <Text style={styles.equivalentText}>{equivalent.train.text}</Text>

                        {/*<Text style={styles.titleText}>Ingrédients</Text>*/}
                        {/*<Text style={styles.defaultText}>{productInfo.ingredients}</Text>*/}

                        {/*{ProductScreen._parseIngredientWithAllergens(product.ingredients)}*/}

                        {/*{ProductScreen._parseAllergens(product.allergens)}*/}

                        {/*<Image*/}
                        {/*style={styles.imageNutri}*/}
                        {/*source={{uri: 'https://static.openfoodfacts.org/images/misc/nutriscore-' + product.nutrition_grades + '.png'}}*/}
                        {/*/>*/}

                        {this._printBasketOptions()}

                    </ScrollView>
                )
            } else if (isConnected) {
                return (
                    <OupsScreen message="Nous n'avons pas trouvé les informations de ce produit :/"/>
                );
            } else {
                return (
                    <OupsScreen message="Pas de connexion internet..."/>
                );
            }
        }
    }

    // _checkAllergies() {
    //     const {product, isLoading, fromHistory, fromBasket, hasCheckedAllergies} = this.state;
    //     if (!isLoading && product && Object.keys(product).length > 0 && !hasCheckedAllergies && !fromHistory && !fromBasket) {
    //         this.state.hasCheckedAllergies = true;
    //         let user = UserService.findAll()[0];
    //         if (user !== undefined && product.allergens_ids) {
    //             let allergens = [];
    //             for (let allergen of product.allergens_ids) {
    //                 for (let user_allergen of Array.from(user.allergies)) {
    //                     if (user_allergen.id === allergen) {
    //                         allergens.push(user_allergen.name);
    //                     }
    //                 }
    //             }
    //             if (allergens.length !== 0) {
    //                 Alert.alert(
    //                     'Attention',
    //                     'Nous avons détecté des ingrédients auquels vous êtes allergique dans ce produit : ' + allergens.join(', ')
    //                 );
    //             }
    //         }
    //     }
    // }

    render() {
        return (
            <View style={styles.mainContainer}>
                {this._displayLoading()}
                {this._displayProductInfo()}
                {/*{this._checkAllergies()}*/}
            </View>
        )
    }
}

export default ProductScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    scrollviewContainer: {
        flex: 1,
        flexDirection: "column"
    },
    headerContainer: {
        flexDirection: "row",
    },
    imageProduct: {
        flex: 1,
        margin: 5,
        resizeMode: 'contain',
    },
    imageNutri: {
        height: 80,
        marginTop: 5,
        marginBottom: 10,
        resizeMode: "contain",
    },
    headerDescription: {
        flex: 1,
    },
    productNameText: {
        fontWeight: 'bold',
        fontSize: 25,
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        color: '#000000',
        textAlign: 'left'
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 18,
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        color: '#000000',
        textAlign: 'left'
    },
    descriptionText: {
        fontStyle: 'italic',
        color: '#666666',
        margin: 5,
        marginBottom: 15
    },
    defaultText: {
        marginLeft: 5,
        marginRight: 5,
    },
    cfpText: {
        marginLeft:5,
        marginRight: 5,
        marginTop: 10,
        fontWeight: 'bold',
        color: mainColor,
        fontSize: 18,
        textAlign: 'center',
    },
    equivalentText:{
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        fontSize: 15,
    },
    cartButton: {
        marginLeft: 15,
        marginRight: 15,
    },
    borderTop: {
        borderTopColor: '#d8d8d8',
        borderTopWidth: 1,
    },
});
