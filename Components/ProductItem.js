import React, { Component } from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import PropTypes from "prop-types";

class ProductItem extends Component {
    render() {
        // TODO: add cfp
        const product = this.props.product;
        const cartCounter = this.props.cartCounter;
        return (
            <View style={styles.mainContainer}>
                <Image
                    style={styles.image}
                    source={{uri: product.imageUrl}}
                />
                <View style={styles.contentContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.titleText}>{product.name}</Text>
                    </View>
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.descriptionText}>
                            {cartCounter > 0? cartCounter + " articles dans le panier": undefined}
                        </Text>
                        <Text>
                            TotalCFP: {product.totalCFP}
                        </Text>
                        <Text>
                            Quantité: {product.weight} {product.weightUnit}
                        </Text>
                        {
                            cartCounter === undefined  // history view
                                ? <Text style={styles.descriptionText}>Scanné : {product.nbScans} fois</Text>
                                : null
                        }
                    </View>
                </View>
            </View>
        )
    }
}

// ProductItem.propTypes = {
//     product: PropTypes.shape({
//         imageUrl: PropTypes.string,
//         name: PropTypes.string.isRequired,
//         barCode: PropTypes.string.isRequired,
//         categories: PropTypes.objectOf(PropTypes.string),
//         nbScans: PropTypes.number.isRequired,
//     }).isRequired,
//     cartCounter: PropTypes.number,
// };

export default ProductItem;

const styles = StyleSheet.create({
    mainContainer: {
        height: 190,
        flexDirection: 'row'
    },
    image: {
        width: 120,
        height: 180,
        margin: 5
    },
    contentContainer: {
        flex: 1,
        margin: 5
    },
    headerContainer: {
        flex: 3,
        flexDirection: 'row'
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 20,
        flex: 1,
        flexWrap: 'wrap',
        paddingRight: 5
    },
    voteText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#666666'
    },
    descriptionContainer: {
        flex: 7
    },
    descriptionText: {
        fontStyle: 'italic',
        color: '#666666'
    },
    dateContainer: {
        flex: 1
    },
    dateText: {
        textAlign: 'right',
        fontSize: 14
    }
});