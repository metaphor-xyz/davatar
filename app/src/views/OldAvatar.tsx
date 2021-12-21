import React, { useState, useEffect } from 'react';
import { Image, ImageStyle } from 'react-native';

import Jazzicon from './Jazzicon';

export interface Props {
  uri?: string | null;
  address?: string | null;
  size: number;
  style?: ImageStyle | ImageStyle[] | null;
}

export default function Avatar({ uri, style, size, address }: Props) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!uri) {
      return;
    }

    const match = new RegExp(/([a-z]+):\/\/(.*)/).exec(uri);
    if (match && match.length === 3) {
      const protocol = match[1];
      const id = match[2];

      switch (protocol) {
        case 'ar': {
          const baseUrl = process.env.NODE_ENV === 'production' ? 'https://arweave.net' : 'https://localhost:1984';

          fetch(`${baseUrl}/graphql`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
              query: `
              {
                transactions(ids: ["${id}"]) {
                  edges {
                    node {
                      id
                      owner {
                        address
                      }
                    }
                  }
                }
              }
              `,
            }),
          })
            .then(d => d.json())
            .then(res => res.data.transactions.edges[0].node)
            .then(tx =>
              fetch(`${baseUrl}/graphql`, {
                method: 'POST',
                headers: {
                  'content-type': 'application/json;charset=UTF-8',
                },
                body: JSON.stringify({
                  query: `
                {
                  transactions(owners: ["${tx.owner.address}"], tags: { name: "Origin", values: ["${tx.id}"] }, sort: HEIGHT_DESC) {
                    edges {
                      node {
                        id
                      }
                    }
                  }
                }
                `,
                }),
              })
            )
            .then(res => res.json())
            .then(res => {
              if (res.data && res.data.transactions.edges.length > 0) {
                setUrl(`${baseUrl}/${res.data.transactions.edges[0].node.id}`);
              } else {
                setUrl(`${baseUrl}/${id}`);
              }
            })
            .catch(e => console.error(e)); // eslint-disable-line

          break;
        }
        case 'http':
        case 'https':
          setUrl(uri);
          break;
        default:
          setUrl(uri);
          break;
      }
    } else {
      setUrl(uri);
    }
  }, [uri]);

  if (!url) {
    if (address) {
      return <Jazzicon address={address} size={size} />;
    } else {
      return null;
    }
  }

  return <Image style={style} source={{ uri: url }} />;
}
