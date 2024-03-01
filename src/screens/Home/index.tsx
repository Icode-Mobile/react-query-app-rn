import { Feather } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import keys from '../../config/keys/index.json';

export default function Home() {
  const [product, setProduct] = useState<string>('');
  const query = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch(`${keys.SERVER_URL}/products`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    refetchInterval: 1000,
  });

  const handleSubmitProduct = async () => {
    if (product) {
      // Enviar produto
      try {
        const response = await fetch(`${keys.SERVER_URL}/create-product`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: product,
          }),
        });
        if (!response.ok) {
          Alert.alert(
            'Servidor Desligado',
            'Houve um erro ao enviar seu produto'
          );
        } else {
          setProduct('');
          Alert.alert(
            'Produto Enviado',
            'Seu produto foi enviado com sucesso!'
          );
        }
      } catch (e) {
        Alert.alert(
          'Servidor Desligado',
          'Houve um erro ao enviar seu produto'
        );
      }
    } else {
      Alert.alert(
        'Campo Obrigatório',
        'É preciso que preencha o campo Produto para criar um novo produto'
      );
    }
  };

  if (query.error) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#111',
          paddingTop: 80,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 18,
            textAlign: 'center',
          }}
        >
          Erro no servidor
        </Text>
      </View>
    );
  }

  if (query.data) {
    return (
      <ScrollView
        style={{
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback
          style={{
            flex: 1,
            backgroundColor: '#111',
          }}
          onPress={Keyboard.dismiss}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: '#111',
              paddingTop: 80,
            }}
          >
            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                width: '90%',
              }}
            >
              <TextInput
                placeholder='Produto'
                placeholderTextColor={'#fff'}
                cursorColor={'#cf8b3e'}
                value={product}
                onChangeText={(t) => setProduct(t)}
                style={{
                  backgroundColor: '#505050',
                  width: '90%',
                  height: 50,
                  paddingLeft: 10,
                  borderRadius: 10,
                  color: '#fff',
                  fontWeight: '600',
                }}
              />
              <TouchableOpacity
                style={{
                  width: 45,
                  height: 45,
                  backgroundColor: product ? '#cf8b3e' : '#5f5f5f',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  marginLeft: 5,
                }}
                disabled={!product}
                activeOpacity={0.8}
                onPress={handleSubmitProduct}
              >
                <Feather name='send' size={24} color={'#fff'} />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 22,
                textAlign: 'center',
                marginTop: 20,
              }}
            >
              Produtos
            </Text>
            <FlatList
              data={query.data.data}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 35,
                    marginVertical: 10,
                  }}
                >
                  <Image
                    source={{
                      cache: 'force-cache',
                      uri: 'https://yata.s3-object.locaweb.com.br/b1da36362690140b82f2615336181d34f58abf5a5fadf78cb182f5aafb43242e',
                    }}
                    width={150}
                    height={150}
                    style={{
                      borderRadius: 10,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      width: '90%',
                    }}
                  >
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 13,
                        fontWeight: '600',
                      }}
                    >
                      {item.name}
                    </Text>
                    <View
                      style={{
                        backgroundColor: '#3f3f3f',
                        borderRadius: 8,
                        padding: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 10,
                          fontWeight: '600',
                        }}
                      >
                        {moment(item.createdAt).format('DD/MM/YYYY - HH:mm')}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              numColumns={2}
              contentContainerStyle={{
                alignItems: 'center',
                marginTop: 10,
                paddingBottom: 20,
              }}
              scrollEnabled={false}
              keyExtractor={(item, index) => item.id}
            />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    );
  } else {
    <View
      style={{
        flex: 1,
        backgroundColor: '#111',
        paddingTop: 80,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 22,
          textAlign: 'center',
        }}
      >
        Produtos
      </Text>
      <Text
        style={{
          color: '#c4c4c4',
          fontSize: 18,
          textAlign: 'center',
        }}
      >
        Sem produtos cadastrados
      </Text>
    </View>;
  }
}
