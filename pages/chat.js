import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMxMjM0NiwiZXhwIjoxOTU4ODg4MzQ2fQ.tZ5doexj1vLSrB1_JyG-EavK0W0y1as1oTri_rwft3I";
const SUPABASE_URL =
  /* "https://kysxypdmtxjlkdysdlas.supabase.co"; /* <- chave db alura | chave db thizeh -> */ "https://ntwewzstjbgttesggyfj.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// fetch(`${SUPABASE_URL}/rest/v1/mensagens?select=*`, {
//   headers: {
//     "Content-Type": "application/json",
//     apikey: SUPABASE_ANON_KEY,
//     Authorization: "Bearer " + SUPABASE_ANON_KEY,
//   },
// })
//   .then((res) => {
//     return res.json();
//   })
//   .then((response) => {
//     console.log(response);
//   });

// Sua lógica vai aqui
/*
//usuario
- Digitar no textarea
- botao enter para enviar
- aparecer no chat(texto na listagem)

// dev
- [X] campo criado
- [X] onChange usando setState (if para o enter limpar a variavel)
- [] Lista de mensagens
*/
// ./Sua lógica vai aqui

// fazer o chat atualizar quando 2 pessoas conversam

function escutaMensagensEmTempoReal() {
  return supabaseClient
    .from("mensagens")
    .on("INSERT", () => {
      console.log("Houve uma nova mensagem");
    })
    .subscribe();
}

export default function ChatPage() {
  const roteamento = useRouter();
  const usuarioLogado = roteamento.query.username;
  console.log("roteamento.query", roteamento.query);
  console.log("usuarioLogado", usuarioLogado);
  const [mensagem, setMensagem] = React.useState("");
  const [listaDeMensagens, setListaDeMensagens] = React.useState([
    // {
    //   id: 1,
    //   de: "omariosouto",
    //   texto:
    //     ":sticker: https://2.bp.blogspot.com/-nH9dxjLwVKs/U9MYpgNHI1I/AAAAAAAAHcQ/1SfREKkwNJY/s1600/Chamander+evolu%C3%A7%C3%A3o+Nintendo+Blast.gif",
    // },
    // {
    //   id: 2,
    //   de: "peas",
    //   texto: "O ternário é zica",
    // },
  ]);

  /* Para os stickers, vamos usar o formato -> ':sticker: URL_da_imagem' */

  React.useEffect(() => {
    supabaseClient
      .from("mensagens")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        console.log("Dados da consulta:", data);
        setListaDeMensagens(data);
      });
    escutaMensagensEmTempoReal();
  }, []);

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      //id: listaDeMensagens.length + 1,
      de: usuarioLogado,
      texto: novaMensagem,
    };

    supabaseClient
      .from("mensagens")
      .insert([
        // Tem que ser um objeto com os MESMOS CAMPOS que você escreveu no supabase
        mensagem,
      ])
      .then(({ data }) => {
        console.log("Criando mensagem: ", data);
        setListaDeMensagens([data[0], ...listaDeMensagens]);
      });
    // Chamada de um backend
    setMensagem("");
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList mensagens={listaDeMensagens} />

          {/* {listaDeMensagens.map((mensagemAtual) => {
            return (
              <li key={mensagemAtual.id}>
                {mensagemAtual.de}: {mensagemAtual.texto}
              </li>
            );
          })} */}

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                const valor = event.target.value;
                setMensagem(valor);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            {/* CallBack */}
            <ButtonSendSticker
              onStickerClick={(sticker) => {
                console.log(
                  "[USANDO O COMPONENTE] Salva esse sticker no banco",
                  sticker
                );
                handleNovaMensagem(":sticker:" + sticker);
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  console.log(props);
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">{mensagem.de}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
            </Box>
            {/*Condicional: if mensagem de texto possui sticker: 
              mostra a imagem
            else
              mensagem.texto */}
            {/* Declarativo */}
            {/* Condicional: {mensagem.texto.startsWith(":sticker:").toString()} */}
            {mensagem.texto.startsWith(":sticker:") ? (
              <Image src={mensagem.texto.replace(":sticker:", "")} />
            ) : (
              mensagem.texto
            )}
            {/* {mensagem.texto} */}
          </Text>
        );
      })}
    </Box>
  );
}
