
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator } from 'react-native';
import { getProductInfoFromApi } from '../API/OFFApi';

class ProductScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product: undefined,
            isLoading: true,
        }
    }

    componentDidMount() {
        getProductInfoFromApi(this.props.navigation.getParam('barcode')).then(data => {
            console.log(data);
            this.setState({
                product: data,
                isLoading: false
            });
        });
    }

    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
    }

    _displayProductInfo() {
        const { product, isLoading } = this.state;
        if (!isLoading) {
            if (product !== undefined && !isLoading) {
                return (
                    <ScrollView style={styles.scrollViewContainer}>
                        <Image
                            style={styles.image}
                            source={{uri: product.image_url}}
                        />
                        <Text style={styles.titleText}>{product.product_name}</Text>
                        <Text style={styles.descriptionText}>Code barre : {product._id}</Text>
                        <Text style={styles.defaultText}>Quantité : {product.quantity}</Text>
                        <Text style={styles.defaultText}>Conditionnement : {product.packaging}</Text>
                        <Text style={styles.defaultText}>Marques : {product.brands}</Text>
                        <Image
                            style={styles.image}
                            source={{uri: 'https://static.openfoodfacts.org/images/misc/nova-group-4.svg'}}
                        />
                        <Image
                            style={styles.image}
                            source={{uri: 'https://static.openfoodfacts.org/images/misc/nutriscore-a.svg'}}
                        />
                    </ScrollView>
                )
            } else {
                return (
                    <View style={styles.center}>
                        <Text style={styles.header}>Oups...</Text>
                        <Text style={styles.infoText}>Nous n'avons pas trouvé les informations de ce produit :/</Text>
                    </View>
                );
            }
        }
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                {this._displayLoading()}
                {this._displayProductInfo()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    loadingContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    scrollViewContainer: {
        flex: 1
    },
    image: {
        height: 169,
        margin: 5
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 35,
        flex: 1,
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        color: '#000000',
        textAlign: 'center'
    },
    descriptionText: {
        fontStyle: 'italic',
        color: '#666666',
        margin: 5,
        marginBottom: 15
    },
    defaultText: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
    },
    header: {
        fontFamily: 'Lobster Regular',
        fontSize: 50,
    },
    infoText: {
        textAlign: 'center',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    }
});

export default ProductScreen;