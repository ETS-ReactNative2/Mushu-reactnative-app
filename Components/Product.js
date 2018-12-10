
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

class ProductScreen extends Component {
    render() {
        return (
            <View style={styles.main_container}>
                <Text>Détails</Text>
                <Text>{this.props.navigation.getParam('productId')}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
    }
})

export default ProductScreen;