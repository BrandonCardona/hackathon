import React, { useState } from "react";
import "./Conecta.css";

// Simulación de publicaciones mejoradas
const initialPosts = [
  {
    id: 1,
    user: "Ana",
    avatar:
      "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D",
    message: "¡Recomiendo la Ruta Centro Histórico! Las fotos son increíbles.",
    image:
      "https://www.turibus.com.mx/documents/6473379/6477595/ccentro_galeriaprincipal_02.jpg/4eab66b3-f53f-5136-d2cf-af42cc3205fb?t=1713811404498",
    likes: 3,
    comments: [
      { user: "Carlos", text: "¡Totalmente de acuerdo!" },
      { user: "Luisa", text: "¿Qué agencia usaste?" },
    ],
  },
  {
    id: 2,
    user: "Pedro",
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww",
    message: "Visité el Jardín Botánico San Jorge, ¡hermoso lugar para fotos!",
    image:
      "https://www.conoceibague.com/wp-content/uploads/2024/01/jardin-bontanico-680x450.jpg",
    likes: 5,
    comments: [{ user: "Ana", text: "¿Cuánto cuesta la entrada?" }],
  },
  {
    id: 3,
    user: "Laura",
    avatar:
      "https://plus.unsplash.com/premium_photo-1688572454849-4348982edf7d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    message:
      "¡No se pierdan el mirador de Juntas! La vista es espectacular y el clima delicioso.",
    image:
      "https://elcronista.co/assets/media/ibague-la-capital-de-los-mejores-miradores-musicalia.jpg",
    likes: 7,
    comments: [
      { user: "Pedro", text: "¿Hay restaurantes cerca?" },
      { user: "Ana", text: "¿Cómo llegaste?" },
    ],
  },
  {
    id: 4,
    user: "Carlos",
    avatar:
      "https://img.freepik.com/foto-gratis/profesor-serio-mirada-inteligente-segura-tiene-barba-bigote-escucha-respuesta-alumno-usa-sueter-rosa-lentes-redondos_273609-16686.jpg?semt=ais_hybrid&w=740&q=80",
    message:
      "La Ruta Gastronómica es perfecta para ir en pareja. Probamos el Altavista y fue delicioso.",
    image:
      "https://tsmnoticias.com/wp-content/uploads/2022/09/La-region-del-Tolima-grande-obtiene-3-nominaciones-en-premios-la-barra-2022-1.jpeg",
    likes: 4,
    comments: [{ user: "Laura", text: "¿Qué plato recomiendas?" }],
  },
];

export default function Conecta() {
  const [posts, setPosts] = useState(initialPosts);
  const [newMessage, setNewMessage] = useState("");
  const [newImage, setNewImage] = useState("");

  // Avatar fijo para el usuario actual
  const userAvatar = "https://randomuser.me/api/portraits/men/1.jpg";

  // Publicar nueva publicación
  const handlePost = () => {
    if (!newMessage) return;
    setPosts([
      {
        id: Date.now(),
        user: "Tú",
        avatar: userAvatar,
        message: newMessage,
        image: newImage,
        likes: 0,
        comments: [],
      },
      ...posts,
    ]);
    setNewMessage("");
    setNewImage("");
  };

  // Dar like
  const handleLike = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  // Comentar
  const handleComment = (id, text) => {
    if (!text) return;
    setPosts(
      posts.map((post) =>
        post.id === id
          ? {
              ...post,
              comments: [
                ...post.comments,
                { user: "Tú", text, avatar: userAvatar },
              ],
            }
          : post
      )
    );
  };

  return (
    <div className="conecta-container">
      <h2 className="conecta-title">Conecta: Publicaciones de viajeros</h2>
      <div className="conecta-new-post">
        <div className="conecta-new-avatar">
          <img
            src="https://randomuser.me/api/portraits/men/1.jpg"
            alt="Tu avatar"
          />
        </div>
        <div className="conecta-new-fields">
          <textarea
            placeholder="¿Qué quieres compartir sobre turismo, rutas o lugares?"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="conecta-textarea"
          />
          <input
            type="text"
            placeholder="URL de imagen (opcional)"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            className="conecta-input"
          />
          <button className="conecta-btn" onClick={handlePost}>
            Publicar
          </button>
        </div>
      </div>
      <div className="conecta-posts">
        {posts.map((post) => (
          <div key={post.id} className="conecta-post">
            <div className="conecta-post-header">
              <img
                src={post.avatar}
                alt={post.user}
                className="conecta-avatar"
              />
              <span className="conecta-user">{post.user}</span>
            </div>
            <div className="conecta-post-body">
              <p className="conecta-message">{post.message}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt="Publicación"
                  className="conecta-img"
                />
              )}
            </div>
            <div className="conecta-post-actions">
              <button
                className="conecta-like-btn"
                onClick={() => handleLike(post.id)}
              >
                👍 {post.likes}
              </button>
            </div>
            <div className="conecta-comments">
              <h4>Comentarios</h4>
              {post.comments.map((c, idx) => (
                <div key={idx} className="conecta-comment">
                  {c.user === "Tú" && (
                    <img
                      src={userAvatar}
                      alt="Tú"
                      className="conecta-avatar"
                      style={{ width: 24, height: 24, marginRight: 6 }}
                    />
                  )}
                  <span className="conecta-comment-user">{c.user}:</span>{" "}
                  {c.text}
                </div>
              ))}
              <ConectaCommentInput
                onComment={(text) => handleComment(post.id, text)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConectaCommentInput({ onComment }) {
  const [text, setText] = useState("");
  return (
    <div className="conecta-comment-input">
      <input
        type="text"
        placeholder="Escribe un comentario..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onComment(text);
            setText("");
          }
        }}
      />
      <button
        onClick={() => {
          onComment(text);
          setText("");
        }}
      >
        Comentar
      </button>
    </div>
  );
}
