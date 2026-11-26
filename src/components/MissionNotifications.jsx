import { useEffect, useRef, useState,} from 'react';
import { useProgressStore, getActiveMissions, isMissionReady,} from '../stores/progressStore';
import { useNavigate } from 'react-router-dom';

export default function MissionNotifications() {

  const navigate = useNavigate();

  const gestureRef = useRef(null);

  const [drag, setDrag] = useState({
    x: 0,
    y: 0,
  });

  const [dragging, setDragging] = useState(false);

  const [dismissing, setDismissing] = useState(false);
  
  const [queue, setQueue,] = useState([]);

  const [visible, setVisible,] = useState(null);

  const [leaving, setLeaving,] = useState(false);
  
  /*
    =========================================================
    OBSERVA PROGRESSO DAS MISSÕES
    =========================================================
  */

  useEffect(() => {
  const unsubscribe = useProgressStore.subscribe(
    (state, previous) => {
      const before = getActiveMissions(previous);
      const after = getActiveMissions(state);

      const notifications = [];
      const progressNotifications = [];
      const unlocked = [];

      function getKey(mission, snapshot) {
        return mission.daily
          ? `${mission.id}-${snapshot.daily.date}`
          : mission.id;
      }

      after.forEach((mission) => {
        const key = getKey(mission, state);

        const oldMission = before.find(
          (item) =>
            getKey(item, previous) === key
        );

        const title = mission.stage
          ? `${mission.title} (${mission.stage}/${mission.totalStages})`
          : mission.title;

        // MISSÃO RECÉM-LIBERADA

        if (!oldMission) {
          unlocked.push({
            mission,
            title,
          });

          return;
        }

        // OBJETIVOS COMPLETOS

        const wasReady =
          isMissionReady(oldMission, previous);

        const ready =
          isMissionReady(mission, state);

        if (!wasReady && ready) {
          notifications.push({
            id: `ready-${key}-${Date.now()}`,

            type: 'complete',

            eyebrow: 'Missão concluída',

            title,

            text: 'Colete suas recompensas!',
          });

          return;
        }

        // PROGRESSO

        // Evita notificações constantes
        // durante atualizações do GPS.

        if (
          ready ||
          mission.line === 'trail-explorer' ||
          mission.id === 'daily-walk'
        ) {
          return;
        }

        const oldValue =
          Math.floor(oldMission.getValue(previous));

        const newValue =
          Math.floor(mission.getValue(state));

        if (newValue > oldValue) {
          progressNotifications.push({
            id: `progress-${key}-${Date.now()}`,

            type: 'progress',

            eyebrow: 'Progresso da missão',

            title,

            text: `${newValue}/${mission.goal}`,
          });
        }
      });

      // NOVA ETAPA OU NOVAS MISSÕES

      if (unlocked.length === 1) {
        const item = unlocked[0];

        notifications.push({
          id: `new-${item.mission.id}-${Date.now()}`,

          type: 'new',

          eyebrow: 'Nova missão disponível',

          title: item.title,

          text: item.mission.description,
        });
      }

      if (unlocked.length > 1) {
        notifications.push({
          id: `new-missions-${Date.now()}`,

          type: 'new',

          eyebrow: 'Novas missões',

          title: 'Novos desafios disponíveis!',

          text:
            `${unlocked.length} missões foram liberadas.`,
        });
      }

      // Prioriza conclusões e desbloqueios.
      // Mostra somente um aviso de progresso
      // quando nenhuma missão foi concluída.

      if (
        notifications.length === 0 &&
        progressNotifications.length > 0
      ) {
        notifications.push(
          progressNotifications[0]
        );
      }

      if (notifications.length > 0) {
        setQueue((current) => [
          ...current,
          ...notifications,
        ]);
      }
    }
  );

  return unsubscribe;
}, []);


  /*
    =========================================================
    PEGA PRÓXIMA NOTIFICAÇÃO
    =========================================================
  */

    useEffect(() => {

      if (visible) {
        return;
      }


      if (
        queue.length === 0
      ) {
        return;
      }


      const [
        next,
        ...remaining
      ] =
        queue;


      setVisible(next);

      setQueue(
        remaining
      );

    }, [
      queue,
      visible,
    ]);


    useEffect(() => {
    if (!visible || dragging || dismissing) {
      return;
    }

    const exitTimer = window.setTimeout(() => {
      setLeaving(true);
    }, 2700);

    const removeTimer = window.setTimeout(() => {
      setVisible(null);
      setLeaving(false);
      setDrag({ x: 0, y: 0 });
    }, 3200);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };

  }, [visible, dragging, dismissing]);


  useEffect(() => {
    if (!dismissing) return;

    const timer = window.setTimeout(() => {
      setVisible(null);
      setLeaving(false);
      setDismissing(false);
      setDragging(false);
      setDrag({ x: 0, y: 0 });
    }, 250);

    return () => window.clearTimeout(timer);

  }, [dismissing]);


/*
  =========================================================
  GESTOS DA NOTIFICAÇÃO
  =========================================================
*/

function openMissions() {
  gestureRef.current = null;

  setVisible(null);
  setQueue([]);
  setLeaving(false);
  setDragging(false);
  setDismissing(false);
  setDrag({ x: 0, y: 0 });

  navigate('/challenges');
}


function handlePointerDown(event) {
  if (
    leaving ||
    dismissing ||
    !event.isPrimary ||
    event.button !== 0
  ) {
    return;
  }

  event.currentTarget.setPointerCapture(
    event.pointerId
  );

  gestureRef.current = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    moved: false,
  };

  setDragging(true);
}


function handlePointerMove(event) {
  const gesture = gestureRef.current;

  if (
    !gesture ||
    gesture.pointerId !== event.pointerId
  ) {
    return;
  }

  const x = event.clientX - gesture.startX;
  const y = event.clientY - gesture.startY;

  if (Math.hypot(x, y) > 8) {
    gesture.moved = true;
  }

  setDrag({
    x,
    y: Math.min(y, 0),
  });
}


function handlePointerUp(event) {
  const gesture = gestureRef.current;

  if (
    !gesture ||
    gesture.pointerId !== event.pointerId
  ) {
    return;
  }

  const x = event.clientX - gesture.startX;
  const y = event.clientY - gesture.startY;

  const distance = Math.hypot(x, y);

  gestureRef.current = null;

  setDragging(false);

  // TOQUE: ABRE AS MISSÕES

  if (!gesture.moved && distance <= 8) {
    openMissions();
    return;
  }

  // ARRASTAR PARA OS LADOS

  if (Math.abs(x) > 80 && Math.abs(x) >= Math.abs(y)) {

    setDismissing(true);

    setDrag({
      x: x > 0
        ? window.innerWidth
        : -window.innerWidth,
      y: Math.min(y, 0),
    });

    return;
  }

  // ARRASTAR PARA CIMA

  if (y < -50) {

    setDismissing(true);

    setDrag({
      x,
      y: -250,
    });

    return;
  }

  // GESTO CURTO: VOLTA AO LUGAR

  setDrag({
      x: 0,
      y: 0,
    });
  }


  function handlePointerCancel() {
    gestureRef.current = null;

    setDragging(false);

    setDrag({
      x: 0,
      y: 0,
    });
  }



  /*
    =========================================================
    NADA PARA MOSTRAR
    =========================================================
  */

  if (!visible) {
    return null;
  }


  return (
    
      <div
        key={visible.id}

        className={`
          mission-toast
          mission-toast-${visible.type}
          ${leaving ? 'mission-toast-leaving' : ''}
          ${dragging ? 'is-dragging' : ''}
          ${dismissing ? 'is-dismissing' : ''}
        `}

        role="button"
        tabIndex={0}

        aria-label={`${visible.eyebrow}: ${visible.title}. Abrir missões.`}

        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onLostPointerCapture={() => {
          if (gestureRef.current) {
            handlePointerCancel();
          }
        }}

        onKeyDown={(event) => {
          if (
            event.key === 'Enter' ||
            event.key === ' '
          ) {
            event.preventDefault();
            openMissions();
          }
        }}

        style={{
          '--drag-x': `${drag.x}px`,
          '--drag-y': `${drag.y}px`,
        }}
      >


      <div className="mission-toast-icon">

        {visible.type ===
        'complete'
          ? '✓'
          : visible.type ===
            'new'
          ? '!'
          : '↑'}

      </div>


      <div className="mission-toast-content">

        <span>
          {visible.eyebrow}
        </span>


        <strong>
          {visible.title}
        </strong>


        <p>
          {visible.text}
        </p>

      </div>

    </div>
  );
}